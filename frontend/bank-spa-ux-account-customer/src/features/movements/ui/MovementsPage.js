/**
 * Movements Page - Main UI Component
 * Feature: Movements
 */

import React, { useState, useEffect } from 'react';
import { useMovements } from './movementHooks';
import { useAccounts } from '../../accounts/ui/accountHooks';
import MovementCard from './MovementCard';
import MovementForm from './MovementForm';
import { API_CONFIG } from '../../../shared/config';

const MovementsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);
  const [filterAccountNumber, setFilterAccountNumber] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  
  const {
    movements,
    loading,
    error,
    loadMovements,
    createMovement,
    updateMovement,
    deleteMovement,
    getMovementsByAccountNumber,
    getMovementsByDateRange
  } = useMovements();

  const { accounts, loadAccounts } = useAccounts();
  
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    loadMovements();
    loadAccounts();
  }, []);

  // Actualizar movimientos filtrados cuando cambian los movimientos o filtros
  useEffect(() => {
    if (!isFiltering) {
      setFilteredMovements(movements);
    }
  }, [movements, isFiltering]);

  const handleNewMovement = () => {
    setEditingMovement(null);
    setShowForm(true);
  };

  const handleEditMovement = (movement) => {
    setEditingMovement(movement);
    setShowForm(true);
  };

  const handleFormSubmit = async (id, movementData) => {
    console.log('MovementsPage recibió datos para guardar:', id, movementData);
    
    try {
      // Validar datos antes de enviar
      if (!movementData.accountNumber) {
        alert('Error: El número de cuenta es obligatorio');
        return;
      }
      
      // Validar que el monto sea válido
      const amount = parseFloat(movementData.amount);
      if (isNaN(amount) || amount <= 0) {
        alert('Error: El monto debe ser un número mayor que cero');
        return;
      }
      
      // Preparar los datos exactamente como los espera el backend
      const dataToSend = {
        accountNumber: movementData.accountNumber,
        date: movementData.date || new Date().toISOString().split('T')[0],
        transactionType: movementData.transactionType || 'CREDIT',
        amount: parseFloat(amount.toFixed(1))
      };
      
      // Solo incluir ID si estamos editando
      if (id) {
        dataToSend.id = id;
      }
      
      console.log('Datos preparados para enviar al API:', dataToSend);
      
      let result;
      if (id) {
        // Editar
        console.log('Actualizando movimiento con ID:', id);
        result = await updateMovement(id, dataToSend);
      } else {
        // Crear
        console.log('Creando nuevo movimiento');
        result = await createMovement(dataToSend);
      }

      console.log('Resultado de la operación:', result);
      
      if (result.success) {
        setShowForm(false);
        setEditingMovement(null);
        // Recargar lista de movimientos para refrescar la UI
        await loadMovements();
      } else {
        // Mostrar error
        alert(`Error: ${result.error || 'Ocurrió un error al guardar el movimiento'}`);
      }
    } catch (error) {
      console.error('Error en handleFormSubmit:', error);
      alert(`Error: ${error.message || 'Ocurrió un error al procesar la solicitud'}`);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMovement(null);
  };

  const handleDeleteMovement = async (idOrAccountNumber) => {
    console.log('[DELETE] MovementsPage received delete request with:', idOrAccountNumber);
    
    try {
      // Buscar el movimiento por ID o número de cuenta
      const movementToDelete = movements.find(movement => 
        movement.id === idOrAccountNumber || 
        String(movement.id) === String(idOrAccountNumber)
      );
      
      if (movementToDelete) {
        console.log('[DELETE] Found movement to delete:', movementToDelete);
        
        // Usar el ID definitivo del movimiento encontrado
        const movementId = movementToDelete.id;
        console.log('[DELETE] Using definitive ID for deletion:', movementId);
        
        // Si encontramos el movimiento pero no tiene ID, abortar
        if (!movementId) {
          console.error('[DELETE] Movement found but has no ID');
          alert('Error: No se puede eliminar este movimiento porque no tiene un ID válido');
          return;
        }
        
        await deleteMovement(movementId);
      } else {
        // Si no encontramos el movimiento, intentar eliminar con el identificador proporcionado
        console.log('[DELETE] Movement not found in state. Trying to delete with provided identifier:', idOrAccountNumber);
        await deleteMovement(idOrAccountNumber);
      }
      
      // Recargar la lista de movimientos para refrescar la UI
      await loadMovements();
      
    } catch (error) {
      console.error('[DELETE] Exception during movement deletion:', error);
      alert(`Error al eliminar el movimiento: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleFilterByAccount = async () => {
    if (!filterAccountNumber) {
      // Si no hay filtro, mostrar todos los movimientos
      setIsFiltering(false);
      loadMovements();
      return;
    }
    
    setIsFiltering(true);
    
    try {
      const accountMovements = await getMovementsByAccountNumber(filterAccountNumber);
      setFilteredMovements(accountMovements);
    } catch (error) {
      console.error('Error filtering by account:', error);
      alert(`Error al filtrar por cuenta: ${error.message}`);
    }
  };

  const handleFilterByDate = async () => {
    const { startDate, endDate } = dateRange;
    
    if (!startDate || !endDate) {
      alert('Por favor ingrese fechas de inicio y fin');
      return;
    }
    
    setIsFiltering(true);
    
    try {
      const rangeMovements = await getMovementsByDateRange(startDate, endDate);
      setFilteredMovements(rangeMovements);
    } catch (error) {
      console.error('Error filtering by date range:', error);
      alert(`Error al filtrar por rango de fechas: ${error.message}`);
    }
  };

  const clearFilters = () => {
    setFilterAccountNumber('');
    setDateRange({ startDate: '', endDate: '' });
    setIsFiltering(false);
    loadMovements();
  };





  if (loading && movements.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando movimientos...</p>
      </div>
    );
  }

  if (error && movements.length === 0) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={loadMovements} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  const displayedMovements = filteredMovements.length > 0 || isFiltering ? filteredMovements : movements;

  return (
    <div className="movements-page">
      <div className="page-header">
        <h1>Movimientos Bancarios</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleNewMovement}
        >
          Nuevo Movimiento
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        <h3>Filtros</h3>
        
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="accountFilter">Filtrar por Cuenta:</label>
            <select
              id="accountFilter"
              value={filterAccountNumber}
              onChange={(e) => setFilterAccountNumber(e.target.value)}
              className="form-control"
            >
              <option value="">Todas las cuentas</option>
              {accounts.map(account => (
                <option 
                  key={account.accountNumber} 
                  value={account.accountNumber}
                >
                  {account.accountNumber} - {account.getAccountTypeName()} ({account.customerName})
                </option>
              ))}
            </select>
            <button 
              className="btn btn-secondary" 
              onClick={handleFilterByAccount}
            >
              Aplicar
            </button>
          </div>
          
          <div className="filter-group">
            <label>Filtrar por Fecha:</label>
            <div className="date-range">
              <input
                type="date"
                placeholder="Fecha inicio"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="form-control"
              />
              <span>a</span>
              <input
                type="date"
                placeholder="Fecha fin"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="form-control"
              />
              <button 
                className="btn btn-secondary" 
                onClick={handleFilterByDate}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
        
        {isFiltering && (
          <button 
            className="btn btn-outline" 
            onClick={clearFilters}
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {showForm ? (
        <MovementForm 
          movement={editingMovement} 
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          {displayedMovements.length === 0 ? (
            <div className="empty-state">
              <p>No hay movimientos {isFiltering ? 'que coincidan con los filtros aplicados' : 'registrados'}.</p>
              {!isFiltering && (
                <button onClick={handleNewMovement} className="btn btn-primary">
                  Crear el Primer Movimiento
                </button>
              )}
            </div>
          ) : (
            <div className="movements-grid">
              {displayedMovements.map(movement => (
                <MovementCard
                  key={movement.id || movement._originalId || Math.random().toString()}
                  movement={movement}
                  onEdit={handleEditMovement}
                  onDelete={handleDeleteMovement}
                />
              ))}
            </div>
          )}
        </>
      )}

      <style jsx="true">{`
        .movements-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .page-header h1 {
          margin: 0;
          color: #2c3e50;
        }
        
        .filters-container {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #e9ecef;
        }
        
        .filters-container h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #343a40;
          font-size: 1.25rem;
        }
        
        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .filter-group {
          flex: 1;
          min-width: 250px;
        }
        
        .filter-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .date-range {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .date-range span {
          color: #6c757d;
        }
        
        .form-control {
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.9rem;
          flex: 1;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-primary:hover {
          background: #0069d9;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
          margin-left: 0.5rem;
        }
        
        .btn-secondary:hover {
          background: #5a6268;
        }
        
        .btn-outline {
          background: transparent;
          color: #6c757d;
          border: 1px solid currentColor;
        }
        
        .btn-outline:hover {
          background: #f8f9fa;
        }
        
        .movements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .loading-container,
        .error-container,
        .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(0,0,0,0.05);
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #007bff;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .error-container {
          color: #dc3545;
        }
        
        .empty-state {
          color: #6c757d;
        }
        
        .empty-state p {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default MovementsPage;