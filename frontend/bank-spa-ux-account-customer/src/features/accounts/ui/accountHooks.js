import { useState, useEffect, useCallback } from 'react';
import { accountsApi } from '../api/accountAdapter';
import { Account } from '../model/accountTypes';
import { logDebug } from '../../../shared/config';


export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await accountsApi.getAll();
      const accountInstances = data.map(a => new Account(a));
      
      setAccounts(accountInstances);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  const getAccountById = useCallback(async (id) => {
    if (!id) {
      setError('ID es requerido para obtener una cuenta');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const accountData = await accountsApi.getById(id);
      return new Account(accountData);
    } catch (err) {
      console.error(`Error getting account ${id}:`, err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const createAccount = useCallback(async (accountData) => {
    try {
      setLoading(true);
      setError(null);
      
      const account = new Account(accountData);
      const validation = account.validate();
      
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Datos de cuenta inválidos',
          validationErrors: validation.errors
        };
      }
      
      const createdAccount = await accountsApi.create(account);
      
      setAccounts(prevAccounts => [...prevAccounts, new Account(createdAccount)]);
      
      return {
        success: true,
        account: new Account(createdAccount)
      };
    } catch (err) {
      console.error('Error creating account:', err);
      setError(err.message);
      
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAccount = useCallback(async (id, accountData) => {
    if (!id) {
      setError('ID es requerido para actualizar una cuenta');
      return {
        success: false,
        error: 'ID es requerido para actualizar una cuenta'
      };
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Updating account with ID:', id);
      const dataWithCorrectId = {
        ...accountData,
        id: id
      };

      const account = new Account(dataWithCorrectId);
      const validation = account.validate();

      if (!validation.isValid) {
        return {
          success: false,
          error: 'Datos de cuenta inválidos',
          validationErrors: validation.errors
        };
      }

      console.log('Sending to API with account:', account);

      const updatedAccount = await accountsApi.update(id, dataWithCorrectId);

      setAccounts(prevAccounts => prevAccounts.map(a => 
        a.id === id ? new Account(updatedAccount) : a
      ));

      return {
        success: true,
        account: new Account(updatedAccount)
      };
    } catch (err) {
      console.error(`Error updating account ${id}:`, err);
      setError(err.message);

      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete an account by ID
   * @param {string|number} id - Account ID
   * @returns {Promise<Object>} Result with success flag
   */
  const deleteAccount = useCallback(async (id) => {
    console.log('[DELETE HOOK] Starting delete operation with ID:', id, typeof id);
    
    // Si no hay ID, intentar encontrar la cuenta por número de cuenta
    if (!id) {
      console.error('[DELETE HOOK] No ID provided, cannot delete');
      setError('No se proporcionó un identificador para la cuenta');
      return {
        success: false,
        error: 'No se puede eliminar esta cuenta porque no tiene un ID válido',
        cancelled: false
      };
    }

    try {
      setLoading(true);
      setError(null);
      
      // Procesar el ID para asegurar que sea utilizable
      const accountId = String(id).trim();
      console.log(`[DELETE HOOK] Processed ID: ${accountId}`);
      
      // Intentar encontrar la cuenta en el estado actual
      let accountToDelete;
      
      // Primero buscar por ID exacto
      accountToDelete = accounts.find(a => 
        String(a.id) === accountId || a.id === Number(accountId)
      );
      
      // Si no se encuentra, buscar por número de cuenta como alternativa
      if (!accountToDelete) {
        accountToDelete = accounts.find(a => a.accountNumber === accountId);
        if (accountToDelete) {
          console.log('[DELETE HOOK] Found account by accountNumber instead of ID');
        }
      }
      
      if (accountToDelete) {
        console.log('[DELETE HOOK] Account to delete:', accountToDelete);
        
        // Usar el ID de la cuenta encontrada
        const finalId = accountToDelete.id || id;
        console.log('[DELETE HOOK] Using finalId for deletion:', finalId);
        
        // Enviar solicitud de eliminación
        await accountsApi.delete(finalId);
        
        // Actualizar estado local
        setAccounts(prevAccounts => 
          prevAccounts.filter(a => a.id !== finalId && a.accountNumber !== id)
        );
        
        console.log('[DELETE HOOK] Account successfully removed from state');
        return { success: true };
      } else {
        // Si no encontramos la cuenta, intentamos varias estrategias
        console.warn('[DELETE HOOK] Account not found in state, trying multiple delete strategies');
        
        try {
          // Intento 1: eliminar por ID directamente
          console.log('[DELETE HOOK] Strategy 1: Delete by ID directly');
          await accountsApi.delete(accountId);
        } catch (error1) {
          console.warn('[DELETE HOOK] Strategy 1 failed:', error1.message);
          
          try {
            // Intento 2: verificar si el ID es un número de cuenta y eliminar por número
            console.log('[DELETE HOOK] Strategy 2: Delete by account number');
            await accountsApi.deleteByAccountNumber(accountId);
          } catch (error2) {
            console.warn('[DELETE HOOK] Strategy 2 failed:', error2.message);
            
            // Si ambas estrategias fallan, relanzar el primer error
            throw error1;
          }
        }
        
        // Actualizar estado local de todos modos por si acaso
        setAccounts(prevAccounts => 
          prevAccounts.filter(a => 
            String(a.id) !== accountId && a.accountNumber !== accountId
          )
        );
        
        return { success: true };
      }
    } catch (err) {
      console.error(`[DELETE HOOK] Error deleting account:`, err);
      setError(err.message);
      
      return {
        success: false,
        error: err.message,
        cancelled: false
      };
    } finally {
      setLoading(false);
    }
  }, [accounts]);

  /**
   * Get accounts by customer ID
   * @param {string|number} customerId - Customer ID
   * @returns {Promise<Array>} Array of account objects
   */
  const getAccountsByCustomerId = useCallback(async (customerId) => {
    if (!customerId) {
      setError('ID del cliente es requerido');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      const accountsData = await accountsApi.getByCustomerId(customerId);
      return accountsData.map(a => new Account(a));
    } catch (err) {
      console.error(`Error getting accounts for customer ${customerId}:`, err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load accounts on initial render
  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return {
    accounts,
    loading,
    error,
    loadAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountsByCustomerId
  };
};

/**
 * Hook for managing account form state
 * @param {Object} initialAccount - Initial account data
 * @param {Function} onSubmit - Submit handler function
 * @returns {Object} Form state and handlers
 */
export const useAccountForm = (initialAccount = new Account(), onSubmit) => {
  const [account, setAccount] = useState(initialAccount);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when initial data changes
  useEffect(() => {
    setAccount(initialAccount);
    setErrors({});
  }, [initialAccount]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : 
                    name === 'initialBalance' ? parseFloat(value) || 0 : 
                    value;
    
    setAccount(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const accountInstance = new Account(account);
    const validation = accountInstance.validate();
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(account.id, account);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    account,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setAccount
  };
};