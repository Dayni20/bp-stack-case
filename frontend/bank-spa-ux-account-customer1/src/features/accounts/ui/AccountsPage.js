import React, { useState, useEffect } from 'react';
import { useAccounts } from './accountHooks';
import { useCustomers } from '../../customers/ui/hooks';
import AccountCard from './AccountCard';
import AccountForm from './AccountForm';

const AccountsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  const {
    accounts,
    loading,
    error,
    loadAccounts,
    createAccount,
    updateAccount,
    deleteAccount
  } = useAccounts();

  const { customers, loadCustomers } = useCustomers();

  useEffect(() => {
    loadAccounts();
    loadCustomers();
  }, []);

  const handleNewAccount = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleFormSubmit = async (id, accountData) => {
    let result;
    if (id) {
      result = await updateAccount(id, accountData);
    } else {
      result = await createAccount(accountData);
    }

    if (result.success) {
      setShowForm(false);
      setEditingAccount(null);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = async (idOrAccountNumber) => {
    console.log('[DELETE] AccountsPage received delete request with:', idOrAccountNumber, 'Type:', typeof idOrAccountNumber);
    
    try {
      const accountToDelete = accounts.find(account => 
        account.id === idOrAccountNumber || 
        String(account.id) === String(idOrAccountNumber) ||
        account.accountNumber === idOrAccountNumber
      );
      
      if (accountToDelete) {
        console.log('[DELETE] Found account to delete:', accountToDelete);
        
        const accountId = accountToDelete.id;
        console.log('[DELETE] Using definitive ID for deletion:', accountId);
        
        if (!accountId) {
          console.log('[DELETE] Account found but has no ID. Using accountNumber for deletion:', accountToDelete.accountNumber);
          await deleteAccount(accountToDelete.accountNumber);
          return;
        }
        
        await deleteAccount(accountId);
      } else {
        console.log('[DELETE] Account not found in state. Trying to delete with provided identifier:', idOrAccountNumber);
        await deleteAccount(idOrAccountNumber);
      }
      
      await loadAccounts();
      
    } catch (error) {
      console.error('[DELETE] Exception during account deletion:', error);
      alert(`Error al eliminar la cuenta: ${error.message || 'Error desconocido'}`);
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando cuentas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>❌ Error: {error}</p>
        <button onClick={loadAccounts} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="accounts-page">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-info">
                <h1>💳 Gestión de Cuentas</h1>
                <p>Administra la información de las cuentas del banco</p>
                <span className="accounts-count">
                  {accounts.length} cuenta{accounts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleNewAccount}
              >
                ➕ Nueva Cuenta
              </button>
            </div>
          </div>

          <div className="accounts-grid">
            {accounts.length === 0 ? (
              <div className="empty-state">
                <h3>No hay cuentas registradas</h3>
                <p>Comienza agregando tu primera cuenta</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleNewAccount}
                >
                  Crear primera cuenta
                </button>
              </div>
            ) : (
              accounts.map(account => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <AccountForm
          account={editingAccount}
          isEditing={!!editingAccount}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          customersList={customers}
        />
      )}

      <style>{`
        .accounts-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .page-header {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-info h1 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 2rem;
        }

        .header-info p {
          margin: 0 0 0.5rem 0;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .accounts-count {
          background: #e9ecef;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #495057;
          font-weight: 500;
        }

        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          background: white;
          border-radius: 12px;
          padding: 4rem 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .empty-state h3 {
          margin: 0 0 1rem 0;
          color: #6c757d;
          font-size: 1.5rem;
        }

        .empty-state p {
          margin: 0 0 2rem 0;
          color: #6c757d;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
          transform: translateY(-2px);
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          background: white;
          border-radius: 12px;
          margin: 2rem;
          padding: 2rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container p {
          color: #dc3545;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .accounts-page {
            padding: 1rem;
          }
          
          .accounts-grid {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountsPage;