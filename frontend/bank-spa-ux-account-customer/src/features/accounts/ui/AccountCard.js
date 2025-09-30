import React from 'react';
import { Account } from '../model/accountTypes';

const AccountCard = ({ account, onEdit, onDelete }) => {
  const handleDelete = () => {
    console.log('[CARD DEBUG] Account object for deletion:', account);
    
    if (!account) {
      console.error('[CARD DEBUG] Account object is null or undefined');
      alert('Error: No se puede eliminar esta cuenta porque no existe');
      return;
    }
    
    if (window.confirm(`¿Seguro que desea eliminar la cuenta ${account.accountNumber}?`)) {
      try {
        let accountId = account._id || account.id;
        
        if (!accountId && account.accountData && account.accountData.id) {
          accountId = account.accountData.id;
        }
        
        console.log('[CARD DEBUG] ID a usar para eliminación:', accountId, typeof accountId);
        
        if (!accountId && account.accountNumber) {
          console.log('[CARD DEBUG] Usando accountNumber como fallback:', account.accountNumber);
          accountId = account.accountNumber;
        }
        
        console.log('[CARD DEBUG] Calling onDelete with ID:', accountId);
        onDelete(accountId);
      } catch (error) {
        console.error('[CARD DEBUG] Error en handleDelete:', error);
        alert('Error al intentar eliminar la cuenta.');
      }
    }
  };

  return (
    <div className="account-card">
      <div className="account-info">
        <div className="account-header">
          <h3>{account.getFormattedAccountNumber()}</h3>
          <span className={`status ${account.getStatusColor()}`}>
            {account.getStatusText()}
          </span>
        </div>
        
        <p><strong>Tipo:</strong> {account.getAccountTypeName()}</p>
        <p><strong>Saldo:</strong> {account.getFormattedBalance()}</p>
        {account.customerName && (
          <p><strong>Cliente:</strong> {account.customerName}</p>
        )}
      </div>
      
      <div className="account-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => onEdit(account)}
        >
          Editar
        </button>
        <button 
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </div>

      <style>{`
        .account-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .account-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .account-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .account-info h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.2rem;
        }
        
        .account-info p {
          margin: 0.5rem 0;
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .status {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status.success {
          background: #d4edda;
          color: #155724;
        }
        
        .status.danger {
          background: #f8d7da;
          color: #721c24;
        }
        
        .account-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover {
          background: #5a6268;
        }
        
        .btn-danger {
          background: #dc3545;
          color: white;
        }
        
        .btn-danger:hover {
          background: #c82333;
        }
      `}</style>
    </div>
  );
};

export default AccountCard;