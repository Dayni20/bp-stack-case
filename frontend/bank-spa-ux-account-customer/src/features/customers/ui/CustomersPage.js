/**
 * Customers Page - Main UI Component
 * Feature: Customers
 */

import React, { useState, useEffect } from 'react';
import { useCustomers } from './hooks';
import CustomerCard from './CustomerCard';
import CustomerForm from './CustomerForm';

const CustomersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  const {
    customers,
    loading,
    error,
    loadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  } = useCustomers();

  // Cargar clientes al montar
  useEffect(() => {
    loadCustomers();
  }, []);

  const handleNewCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleFormSubmit = async (id, customerData) => {
    let result;
    if (id) {
      // Editar
      result = await updateCustomer(id, customerData);
    } else {
      // Crear
      result = await createCustomer(customerData);
    }

    if (result.success) {
      setShowForm(false);
      setEditingCustomer(null);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = async (id) => {
    console.log('[DELETE] CustomersPage received delete request for ID:', id);
    
    if (!id) {
      console.error('[DELETE] Attempted to delete customer with invalid ID');
      return;
    }
    
    const result = await deleteCustomer(id);
    
    if (!result.success && !result.cancelled) {
      // Mostrar error solo si no fue cancelado por el usuario
      console.error('[DELETE] Error deleting customer:', result.error);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>❌ Error: {error}</p>
        <button onClick={loadCustomers} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="customers-page">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-info">
                <h1>👥 Gestión de Clientes</h1>
                <p>Administra la información de los clientes del banco</p>
                <span className="customers-count">
                  {customers.length} cliente{customers.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleNewCustomer}
              >
                ➕ Nuevo Cliente
              </button>
            </div>
          </div>

          {/* Lista de Clientes */}
          <div className="customers-grid">
            {customers.length === 0 ? (
              <div className="empty-state">
                <h3>No hay clientes registrados</h3>
                <p>Comienza agregando tu primer cliente</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleNewCustomer}
                >
                  Crear primer cliente
                </button>
              </div>
            ) : (
              customers.map(customer => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onEdit={handleEditCustomer}
                  onDelete={handleDeleteCustomer}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <CustomerForm
          customer={editingCustomer}
          isEditing={!!editingCustomer}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      <style>{`
        .customers-page {
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

        .customers-count {
          background: #e9ecef;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #495057;
          font-weight: 500;
        }

        .customers-grid {
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
          .customers-page {
            padding: 1rem;
          }
          
          .customers-grid {
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

export default CustomersPage;