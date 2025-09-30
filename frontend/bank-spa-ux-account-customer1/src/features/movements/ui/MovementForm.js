/**
 * Movement Form Component
 * Feature: Movements
 */

import React, { useState, useEffect } from 'react';
import { Movement, MovementTypes } from '../model/movementTypes';
import { useAccounts } from '../../accounts/ui/accountHooks';

/**
 * Formulario para crear y editar movimientos bancarios
 */
const MovementForm = ({ movement = null, onSubmit, onCancel }) => {
  const isEdit = !!movement?.id;
  const title = isEdit ? 'Editar Movimiento' : 'Nuevo Movimiento';
  
  // Obtener las cuentas disponibles
  const { accounts, loading: loadingAccounts } = useAccounts();
  
  // Estado del formulario directamente en el componente (sin usar hook externo)
  const [formData, setFormData] = useState({
    id: movement?.id || null,
    accountNumber: movement?.accountNumber || '',
    date: movement?.date || new Date().toISOString().split('T')[0],
    transactionType: movement?.transactionType || MovementTypes.CREDIT,
    amount: movement?.amount || '',
    balance: movement?.balance || 0
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  // Inicializar formulario cuando cambia el movimiento
  useEffect(() => {
    console.log('Inicializando formulario con:', movement);
    if (movement) {
      setFormData({
        id: movement.id || null,
        accountNumber: movement.accountNumber || '',
        date: movement.date || new Date().toISOString().split('T')[0],
        transactionType: movement.transactionType || MovementTypes.CREDIT,
        amount: movement.amount || '',
        balance: movement.balance || 0
      });
      setErrors({});
    }
  }, [movement]);
  
  // Buscar la cuenta correspondiente cuando se carga el formulario o cambia el número de cuenta
  useEffect(() => {
    if (accounts.length > 0 && formData.accountNumber) {
      const account = accounts.find(a => a.accountNumber === formData.accountNumber);
      setSelectedAccount(account);
    }
  }, [accounts, formData.accountNumber]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Manejo especial para inputs numéricos
    if (name === 'amount') {
      // Permitir solo números y punto decimal
      const numericValue = value.replace(/[^0-9.]/g, '');
      
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpiar error correspondiente
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleAccountChange = (e) => {
    const accountNumber = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      accountNumber
    }));
    
    const selectedAcc = accounts.find(a => a.accountNumber === accountNumber);
    setSelectedAccount(selectedAcc);
    
    if (errors.accountNumber) {
      setErrors(prev => ({
        ...prev,
        accountNumber: null
      }));
    }
  };
  
  const validateForm = () => {
    const movement = new Movement(formData);
    const validation = movement.validate();
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Asegurar que el monto se envía como número
      const submissionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      const result = await onSubmit(formData.id, submissionData);
      
      if (result.success) {
        onCancel(); // Cerrar el formulario
      } else {
        // Manejar errores devueltos por el API
        setErrors({
          submit: result.error || 'Error al guardar el movimiento'
        });
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setErrors({
        submit: error.message || 'Error al procesar la solicitud'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="movement-form">
      <h2>{title}</h2>
      
      {errors.submit && (
        <div className="error-banner">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Cuenta</label>
          <select
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleAccountChange}
            className={errors.accountNumber ? 'error' : ''}
            disabled={isSubmitting || loadingAccounts || isEdit}
          >
            <option value="">Seleccione una cuenta</option>
            {accounts.map(account => (
              <option key={account.id} value={account.accountNumber}>
                {account.accountNumber} - {account.accountType} 
                {account.customerName && ` (${account.customerName})`}
              </option>
            ))}
          </select>
          {errors.accountNumber && (
            <span className="error-message">{errors.accountNumber}</span>
          )}
          
          {selectedAccount && (
            <div className="account-info">
              <p>Saldo actual: {selectedAccount.getFormattedBalance()}</p>
              <p>Estado: {selectedAccount.getStatusText()}</p>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label>Fecha</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.date && (
            <span className="error-message">{errors.date}</span>
          )}
        </div>
        
        <div className="form-group">
          <label>Tipo de Transacción</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="transactionType"
                value={MovementTypes.CREDIT}
                checked={formData.transactionType === MovementTypes.CREDIT}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Depósito
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="transactionType"
                value={MovementTypes.DEBIT}
                checked={formData.transactionType === MovementTypes.DEBIT}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Retiro
            </label>
          </div>
          {errors.transactionType && (
            <span className="error-message">{errors.transactionType}</span>
          )}
        </div>
        
        <div className="form-group">
          <label>Monto</label>
          <div className="amount-input">
            <span className="currency-symbol">$</span>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={errors.amount ? 'error' : ''}
              disabled={isSubmitting}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <span className="error-message">{errors.amount}</span>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
      
      <style>{`
        .movement-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .movement-form h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #2c3e50;
          font-size: 1.5rem;
          text-align: center;
        }
        
        .error-banner {
          background: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          text-align: center;
          border: 1px solid #f5c6cb;
        }
        
        .form-group {
          margin-bottom: 1.2rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #495057;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: border-color 0.15s ease-in-out;
        }
        
        .form-group input:focus,
        .form-group select:focus {
          border-color: #80bdff;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .form-group input.error,
        .form-group select.error {
          border-color: #dc3545;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.8rem;
          margin-top: 0.25rem;
          display: block;
        }
        
        .account-info {
          background: #f8f9fa;
          border-radius: 6px;
          padding: 0.75rem;
          margin-top: 0.5rem;
          border: 1px dashed #ced4da;
        }
        
        .account-info p {
          margin: 0.25rem 0;
          font-size: 0.85rem;
          color: #495057;
        }
        
        .radio-group {
          display: flex;
          gap: 1rem;
        }
        
        .radio-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: normal;
        }
        
        .radio-label input {
          margin-right: 0.5rem;
          width: auto;
        }
        
        .amount-input {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .currency-symbol {
          position: absolute;
          left: 0.75rem;
          font-weight: bold;
          color: #495057;
        }
        
        .amount-input input {
          padding-left: 1.5rem;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #0069d9;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #5a6268;
        }
      `}</style>
    </div>
  );
};

export default MovementForm;