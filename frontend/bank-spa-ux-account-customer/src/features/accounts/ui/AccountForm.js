import React from 'react';
import { AccountTypes } from '../model/accountTypes';

const AccountForm = ({ 
  account, 
  isEditing, 
  onSubmit, 
  onCancel, 
  customersList = [] 
}) => {

  const [formData, setFormData] = React.useState({
    accountNumber: account?.accountNumber || '',
    accountType: account?.accountType || AccountTypes.SAVINGS,
    initialBalance: account?.initialBalance || 0,
    status: account?.status ?? true,
    customerId: account?.customerId || '',
    customerName: account?.customerName || ''
  });
  
  const [formErrors, setFormErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  React.useEffect(() => {
    if (account) {
      setFormData({
        accountNumber: account.accountNumber || '',
        accountType: account.accountType || AccountTypes.SAVINGS,
        initialBalance: account.initialBalance || 0,
        status: account.status ?? true,
        customerId: account.customerId || '',
        customerName: account.customerName || ''
      });
      setFormErrors({});
    }
  }, [account]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : 
                    name === 'initialBalance' ? parseFloat(value) || 0 : 
                    value;
                    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const selectedCustomer = customersList.find(c => c.id === customerId);
    
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: selectedCustomer ? `${selectedCustomer.nombre}` : ''
    }));

    if (formErrors.customerId) {
      setFormErrors(prev => ({
        ...prev,
        customerId: null
      }));
    }
  };
  

  const validateForm = () => {
    const errors = {};
    
    if (!formData.accountNumber) {
      errors.accountNumber = 'El número de cuenta es requerido';
    }
    
    if (!formData.accountType) {
      errors.accountType = 'El tipo de cuenta es requerido';
    }
    
    if (formData.initialBalance === null || formData.initialBalance === undefined) {
      errors.initialBalance = 'El saldo inicial es requerido';
    }
    
    if (!formData.customerId) {
      errors.customerId = 'El cliente es requerido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(account?.id, formData);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="account-form">
      <h2>{isEditing ? 'Editar Cuenta' : 'Nueva Cuenta'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número de Cuenta</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className={formErrors.accountNumber ? 'error' : ''}
            disabled={isSubmitting}
          />
          {formErrors.accountNumber && (
            <span className="error-message">{formErrors.accountNumber}</span>
          )}
        </div>
        
        <div className="form-group">
          <label>Tipo de Cuenta</label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className={formErrors.accountType ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Seleccione un tipo</option>
            <option value={AccountTypes.SAVINGS}>Ahorros</option>
            <option value={AccountTypes.CHECKING}>Corriente</option>
            <option value={AccountTypes.LOAN}>Préstamo</option>
            <option value={AccountTypes.CREDIT}>Crédito</option>
          </select>
          {formErrors.accountType && (
            <span className="error-message">{formErrors.accountType}</span>
          )}
        </div>
        
        <div className="form-group">
          <label>Saldo Inicial</label>
          <input
            type="number"
            step="0.01"
            name="initialBalance"
            value={formData.initialBalance}
            onChange={handleChange}
            className={formErrors.initialBalance ? 'error' : ''}
            disabled={isSubmitting}
          />
          {formErrors.initialBalance && (
            <span className="error-message">{formErrors.initialBalance}</span>
          )}
        </div>
        
        <div className="form-group">
          <label>Cliente</label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleCustomerChange}
            className={formErrors.customerId ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Seleccione un cliente</option>
            {customersList.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.nombre} {customer.telefono ? `- ${customer.telefono}` : ''}
              </option>
            ))}
          </select>
          {formErrors.customerId && (
            <span className="error-message">{formErrors.customerId}</span>
          )}
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            Cuenta Activa
          </label>
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
            {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
      
      <style>{`
        .account-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .account-form h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #2c3e50;
          font-size: 1.5rem;
          text-align: center;
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
        
        .checkbox-group {
          display: flex;
          align-items: center;
        }
        
        .checkbox-group label {
          margin-bottom: 0;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .checkbox-group input {
          margin-right: 0.5rem;
          width: auto;
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

export default AccountForm;