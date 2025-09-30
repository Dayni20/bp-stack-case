/**
 * Movement Card Component
 * Feature: Movements
 */

import React from 'react';
import { Movement } from '../model/movementTypes';

const MovementCard = ({ movement, onEdit, onDelete }) => {
  const handleDelete = () => {
    console.log('[CARD DEBUG] Movement object for deletion:', movement);
    
    // Verificar que tenemos un movimiento válido
    if (!movement) {
      console.error('[CARD DEBUG] Movement object is null or undefined');
      alert('Error: No se puede eliminar este movimiento porque no existe');
      return;
    }
    
    // Confirmar eliminación con información detallada para facilitar identificación
    if (window.confirm(
      `¿Seguro que desea eliminar este ${movement.isCredit() ? 'depósito' : 'retiro'} ` + 
      `de ${movement.getFormattedAmount()} ` +
      `realizado el ${movement.getFormattedDate()} ` +
      `para la cuenta ${movement.accountNumber}?`
    )) {
      try {
        // Para solucionar posibles problemas de ID, intentamos diferentes enfoques
        let movementId = movement._id || movement.id;
        
        console.log('[CARD DEBUG] ID a usar para eliminación:', movementId, typeof movementId);
        
        // Enviar el ID al padre para procesar la eliminación
        console.log('[CARD DEBUG] Calling onDelete with ID:', movementId);
        onDelete(movementId);
      } catch (error) {
        console.error('[CARD DEBUG] Error en handleDelete:', error);
        alert('Error al intentar eliminar el movimiento.');
      }
    }
  };

  return (
    <div className="movement-card">
      <div className="movement-info">
        <div className="movement-header">
          <h3>{movement.accountNumber}</h3>
          <span className={`status ${movement.getTransactionTypeColor()}`}>
            {movement.getTransactionTypeName()}
          </span>
        </div>
        
        <p><strong>Fecha:</strong> {movement.getFormattedDate()}</p>
        <p><strong>Monto:</strong> {movement.getFormattedAmount()}</p>
        <p><strong>Saldo Resultante:</strong> {movement.getFormattedBalance()}</p>
      </div>
      
      <div className="movement-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => onEdit(movement)}
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
        .movement-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .movement-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .movement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .movement-info h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.2rem;
        }
        
        .movement-info p {
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
        
        .status.warning {
          background: #fff3cd;
          color: #856404;
        }
        
        .movement-actions {
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

export default MovementCard;