/**
 * Customer Card Component
 * Feature: Customers
 */

import React from 'react';

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  const handleDelete = () => {
    console.log('[CARD DEBUG] Customer object:', customer);
    console.log('[CARD DEBUG] Customer ID:', customer.id, 'Type:', typeof customer.id);
    console.log('[CARD DEBUG] Customer keys:', Object.keys(customer));
    
    // Verify we have a customer instance with a valid ID
    if (!customer) {
      console.error('[CARD DEBUG] Customer object is null or undefined');
      alert('Error: No se puede eliminar este cliente porque no existe');
      return;
    }
    
    // Check for valid ID - should be number or non-empty string
    const hasValidId = (
      (typeof customer.id === 'number') || 
      (typeof customer.id === 'string' && customer.id.trim() !== '')
    );
    
    if (hasValidId) {
      // Show ID in confirm message to help debug
      if (window.confirm(`¿Confirmar eliminar cliente "${customer.nombre}" (ID: ${customer.id})?`)) {
        onDelete(customer.id);
      }
    } else {
      console.error('[CARD DEBUG] Missing ID for deletion. Customer:', customer);
      alert('Error: No se puede eliminar este cliente porque no tiene un ID válido.');
    }
  };

  return (
    <div className="customer-card">
      <div className="customer-info">
        <h3>{customer.getDisplayName()}</h3>
        <p><strong>Dirección:</strong> {customer.direccion || 'Sin dirección'}</p>
        <p><strong>Teléfono:</strong> {customer.telefono}</p>
        <p><strong>Estado:</strong> 
          <span className={`status ${customer.getStatusColor()}`}>
            {customer.estado}
          </span>
        </p>
      </div>
      <div className="customer-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => onEdit(customer)}
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
        .customer-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .customer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .customer-info h3 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
          font-size: 1.2rem;
        }
        
        .customer-info p {
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
        
        .customer-actions {
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

export default CustomerCard;