/**
 * Account API Adapter
 * Feature: Accounts
 * Handles all HTTP requests related to account management
 */

import { API_CONFIG, ERROR_MESSAGES, logDebug } from '../../../shared/config';

/**
 * Processes HTTP response and handles common errors
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object|null>} Parsed JSON or null for 204 responses
 * @throws {Error} Formatted error message based on status code
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      // Try to get error details from response
      const errorData = await response.json();
      errorMessage = errorData.message || ERROR_MESSAGES.UNKNOWN;
    } catch (e) {
      // If parsing fails, use standard error based on status code
      switch(response.status) {
        case 400: errorMessage = ERROR_MESSAGES.VALIDATION; break;
        case 401: case 403: errorMessage = ERROR_MESSAGES.UNAUTHORIZED; break;
        case 404: errorMessage = ERROR_MESSAGES.NOT_FOUND; break;
        case 500: errorMessage = ERROR_MESSAGES.SERVER; break;
        default: errorMessage = `${ERROR_MESSAGES.UNKNOWN} (${response.status})`;
      }
    }
    throw new Error(errorMessage);
  }
  
  // Return null for 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

/**
 * Maps backend account data format to frontend format
 * @param {Object} backendAccount - Account data from API
 * @returns {Object} Formatted account data for frontend
 */
const mapBackendToFrontend = (backendAccount) => {
  logDebug('Mapping backend account data', backendAccount);
  
  if (!backendAccount) {
    console.error('[ADAPTER] Null or undefined backend account data');
    return {};
  }
  
  // Búsqueda exhaustiva de ID en las propiedades del objeto
  let accountId = null;
  
  // Intentar extraer el ID de varias propiedades posibles en el orden de prioridad
  const idProperties = ['id', '_id', 'accountId', 'ID', 'Id'];
  for (const prop of idProperties) {
    if (backendAccount[prop] !== undefined && backendAccount[prop] !== null) {
      accountId = backendAccount[prop];
      console.log(`[ADAPTER] Found account ID in backend data at property '${prop}': ${accountId}`);
      break;
    }
  }
  
  // Si no se encontró un ID pero hay un número de cuenta, usarlo como ID (sólo para depuración)
  if (accountId === null && backendAccount.accountNumber) {
    console.warn('[ADAPTER] No ID found in backend data, using accountNumber as a reference');
  }
  
  // Construir el objeto con todos los datos disponibles
  const mappedAccount = {
    id: accountId,
    // Guardar el ID original por si acaso (para depuración)
    _originalId: accountId,
    accountNumber: backendAccount.accountNumber || '',
    accountType: backendAccount.accountType || '',
    initialBalance: typeof backendAccount.initialBalance === 'number' ? backendAccount.initialBalance : 0,
    status: typeof backendAccount.status === 'boolean' ? backendAccount.status : true,
    customerId: backendAccount.customerId || '',
    customerName: backendAccount.customerName || ''
  };
  
  logDebug('Mapped to frontend', mappedAccount);
  return mappedAccount;
};

/**
 * Maps frontend account data to backend format
 * @param {Object} frontendAccount - Account data from UI
 * @returns {Object} Formatted account data for backend
 */
const mapFrontendToBackend = (frontendAccount) => {
  console.log('[ADAPTER] Mapping frontend account to backend format:', frontendAccount);
  
  // Iniciar con los datos básicos
  const data = {
    accountNumber: frontendAccount.accountNumber || '',
    accountType: frontendAccount.accountType || '',
    initialBalance: typeof frontendAccount.initialBalance === 'number' ? frontendAccount.initialBalance : 0,
    status: typeof frontendAccount.status === 'boolean' ? frontendAccount.status : true,
    customerId: frontendAccount.customerId || '',
    customerName: frontendAccount.customerName || ''
  };
  
  // Añadir ID si existe - SIEMPRE incluir el ID en el payload
  if (frontendAccount.id !== undefined && frontendAccount.id !== null) {
    console.log('[ADAPTER] Including ID in backend data:', frontendAccount.id);
    data.id = frontendAccount.id;
  } else if (frontendAccount._originalId) {
    // Alternativa: usar el ID original si existe
    console.log('[ADAPTER] Using original ID as fallback:', frontendAccount._originalId);
    data.id = frontendAccount._originalId;
  }
  
  // Si hay un ID en el frontend, incluirlo explícitamente para operaciones PUT
  if (frontendAccount.id) {
    data.id = frontendAccount.id;
  }
  
  logDebug('Sending account to backend', data);
  return data;
};

/**
 * Account API service
 * Implementation based on Postman collection for account management
 */
export const accountsApi = {
  /**
   * Get all accounts
   * @returns {Promise<Array>} Array of account objects mapped to frontend format
   * @throws {Error} Network or server errors
   */
  async getAll() {
    logDebug('Fetching all accounts');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS}`, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      
      const backendData = await handleResponse(response);
      
      // Map backend data to frontend format
      if (Array.isArray(backendData)) {
        return backendData.map(mapBackendToFrontend);
      }
      return [];
    } catch (error) {
      console.error('Error fetching accounts:', error);
      
      // Handle CORS errors specifically
      if (error.message.includes('CORS') || error.message.includes('NetworkError')) {
        throw new Error(ERROR_MESSAGES.NETWORK);
      }
      
      throw error;
    }
  },
  
  /**
   * Get account by ID
   * @param {string|number} id - Account ID
   * @returns {Promise<Object>} Account object
   * @throws {Error} Network or server errors
   */
  async getById(id) {
    if (!id) {
      throw new Error('ID es requerido para obtener una cuenta');
    }
    
    logDebug(`Fetching account with ID: ${id}`);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS}/${id}`, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      
      const backendData = await handleResponse(response);
      return mapBackendToFrontend(backendData);
    } catch (error) {
      console.error(`Error fetching account ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new account
   * @param {Object} accountData - Account data
   * @returns {Promise<Object>} Created account
   * @throws {Error} Network or server errors
   */
  async create(accountData) {
    logDebug('Creating account with data:', accountData);
    
    try {
      const backendData = mapFrontendToBackend(accountData);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(backendData)
      });
      
      const createdAccount = await handleResponse(response);
      return mapBackendToFrontend(createdAccount);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing account
   * @param {string|number} id - Account ID
   * @param {Object} accountData - Updated account data
   * @returns {Promise<Object>} Updated account
   * @throws {Error} Network or server errors
   */
  async update(id, accountData) {
    if (!id) {
      throw new Error('ID es requerido para actualizar una cuenta');
    }
    
    logDebug(`Updating account ${id} with data:`, accountData);
    
    try {
      // Asegurarse de que el ID se incluya en los datos
      const dataWithId = { ...accountData, id: id };
      const backendData = mapFrontendToBackend(dataWithId);
      
      console.log('Backend data for update:', backendData);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS}/${id}`, {
        method: 'PUT',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(backendData)
      });
      
      const updatedAccount = await handleResponse(response);
      return mapBackendToFrontend(updatedAccount);
    } catch (error) {
      console.error(`Error updating account ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete an account by ID
   * @param {string|number} id - Account ID
   * @returns {Promise<boolean>} Success status
   * @throws {Error} Network or server errors
   */
  async delete(id) {
    // Validación de ID más exhaustiva
    if (id === null || id === undefined || id === '' || id === 'null' || id === 'undefined') {
      throw new Error('No se puede eliminar esta cuenta porque no tiene un ID válido');
    }
    
    // Asegurar que el ID es un valor utilizable
    const accountId = String(id).trim();
    
    // Log para depuración
    console.log(`[ADAPTER] Deleting account with processed ID: ${accountId}, original type: ${typeof id}`);
    
    try {
      // Construir la URL base correctamente
      const baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS}`;
      console.log(`[ADAPTER] Base URL for deletion: ${baseUrl}`);
      
      // Preparar opciones para la solicitud DELETE
      const fetchOptions = {
        method: 'DELETE',
        headers: API_CONFIG.HEADERS,
      };
      
      // Intentar primero con la URL estándar
      let deleteUrl = `${baseUrl}/${accountId}`;
      console.log(`[ADAPTER] Sending DELETE request to: ${deleteUrl}`);
      
      let response = await fetch(deleteUrl, fetchOptions);
      
      // Si falla, intentar con query params como fallback (algunas APIs lo usan)
      if (!response.ok && response.status !== 204) {
        console.log('[ADAPTER] First DELETE attempt failed, trying alternative formats...');
        
        // Intento alternativo: enviar ID como query param
        deleteUrl = `${baseUrl}?id=${accountId}`;
        console.log(`[ADAPTER] Trying with query params: ${deleteUrl}`);
        response = await fetch(deleteUrl, fetchOptions);
        
        // Si sigue fallando, último intento con ID incrustado en la URL de otra manera
        if (!response.ok && response.status !== 204) {
          deleteUrl = `${baseUrl}/delete/${accountId}`;
          console.log(`[ADAPTER] Last attempt with: ${deleteUrl}`);
          response = await fetch(deleteUrl, fetchOptions);
        }
      }
      
      console.log('[ADAPTER] DELETE response:', response);
      console.log('[ADAPTER] DELETE response status:', response.status);
      
      // Manejo de respuesta según el status
      if (response.status === 204) {
        console.log('[ADAPTER] Account successfully deleted (204 No Content)');
        return true;
      } else if (response.ok) {
        console.log('[ADAPTER] Account successfully deleted (OK status)');
        return true;
      } else {
        // Intentar obtener detalles del error
        try {
          const errorData = await response.json();
          console.error('[ADAPTER] Delete error details:', errorData);
          throw new Error(errorData.message || `Error al eliminar (${response.status})`);
        } catch (parseError) {
          // Si no podemos parsear la respuesta como JSON
          throw new Error(`Error al eliminar la cuenta. Código: ${response.status}`);
        }
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting account ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get accounts by customer ID
   * @param {string|number} customerId - Customer ID
   * @returns {Promise<Array>} Array of account objects
   * @throws {Error} Network or server errors
   */
  async getByCustomerId(customerId) {
    if (!customerId) {
      throw new Error('ID del cliente es requerido');
    }
    
    logDebug(`Fetching accounts for customer: ${customerId}`);
    
    try {
      // First get all accounts then filter by customer ID
      // This is a workaround if the API doesn't have a direct endpoint for this
      const allAccounts = await this.getAll();
      const customerAccounts = allAccounts.filter(account => 
        account.customerId && account.customerId.toString() === customerId.toString()
      );
      
      return customerAccounts;
    } catch (error) {
      console.error(`Error fetching accounts for customer ${customerId}:`, error);
      throw error;
    }
  },

  /**
   * Delete an account by account number (alternative method)
   * @param {string} accountNumber - Account number
   * @returns {Promise<boolean>} Success status
   * @throws {Error} Network or server errors
   */
  async deleteByAccountNumber(accountNumber) {
    if (!accountNumber) {
      throw new Error('El número de cuenta es requerido para la eliminación');
    }
    
    console.log(`[ADAPTER] Attempting to delete by account number: ${accountNumber}`);
    
    try {
      // Primero buscar todas las cuentas
      const accounts = await this.getAll();
      
      // Encontrar la cuenta con el número especificado
      const account = accounts.find(a => a.accountNumber === accountNumber);
      
      if (!account) {
        throw new Error(`No se encontró ninguna cuenta con el número ${accountNumber}`);
      }
      
      console.log(`[ADAPTER] Found account with number ${accountNumber}, ID: ${account.id}`);
      
      // Usar el ID encontrado para eliminar
      if (account.id) {
        return await this.delete(account.id);
      } else {
        throw new Error('La cuenta encontrada no tiene un ID válido');
      }
    } catch (error) {
      console.error(`[ADAPTER] Error deleting account by number ${accountNumber}:`, error);
      throw error;
    }
  }
};