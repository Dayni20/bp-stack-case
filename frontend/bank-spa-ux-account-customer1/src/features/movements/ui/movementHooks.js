/**
 * Movement Hooks
 * Feature: Movements
 * React hooks for movement management operations
 */

import { useState, useEffect, useCallback } from 'react';
import { movementsApi } from '../api/movementAdapter';
import { Movement } from '../model/movementTypes';
import { logDebug } from '../../../shared/config';

/**
 * Main hook for movement management operations
 * @returns {Object} Movement operations and state
 */
export const useMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load all movements from API
   */
  const loadMovements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await movementsApi.getAll();
      const movementInstances = data.map(m => new Movement(m));
      
      setMovements(movementInstances);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get movement by ID
   * @param {string|number} id - Movement ID
   * @returns {Promise<Object>} Movement object
   */
  const getMovementById = useCallback(async (id) => {
    if (!id) {
      setError('ID es requerido para obtener un movimiento');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const movementData = await movementsApi.getById(id);
      return new Movement(movementData);
    } catch (err) {
      console.error(`Error getting movement ${id}:`, err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new movement
   * @param {Object} movementData - Movement data
   * @returns {Promise<Object>} Result with success flag and movement
   */
  const createMovement = useCallback(async (movementData) => {
    try {
      setLoading(true);
      setError(null);
      
      const movement = new Movement(movementData);
      const validation = movement.validate();
      
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Datos de movimiento inválidos',
          validationErrors: validation.errors
        };
      }
      
      const createdMovement = await movementsApi.create(movement);
      
      setMovements(prevMovements => [...prevMovements, new Movement(createdMovement)]);
      
      return {
        success: true,
        movement: new Movement(createdMovement)
      };
    } catch (err) {
      console.error('Error creating movement:', err);
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
   * Update an existing movement
   * @param {string|number} id - Movement ID
   * @param {Object} movementData - Updated movement data
   * @returns {Promise<Object>} Result with success flag and movement
   */
  const updateMovement = useCallback(async (id, movementData) => {
    if (!id) {
      setError('ID es requerido para actualizar un movimiento');
      return {
        success: false,
        error: 'ID es requerido para actualizar un movimiento'
      };
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Updating movement with ID:', id);
      const dataWithCorrectId = {
        ...movementData,
        id: id
      };

      const movement = new Movement(dataWithCorrectId);
      const validation = movement.validate();

      if (!validation.isValid) {
        return {
          success: false,
          error: 'Datos de movimiento inválidos',
          validationErrors: validation.errors
        };
      }

      console.log('Sending to API with movement:', movement);

      const updatedMovement = await movementsApi.update(id, dataWithCorrectId);

      setMovements(prevMovements => prevMovements.map(m => 
        m.id === id ? new Movement(updatedMovement) : m
      ));

      return {
        success: true,
        movement: new Movement(updatedMovement)
      };
    } catch (err) {
      console.error(`Error updating movement ${id}:`, err);
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
   * Delete a movement by ID
   * @param {string|number} id - Movement ID
   * @returns {Promise<Object>} Result with success flag
   */
  const deleteMovement = useCallback(async (id) => {
    if (!id) {
      setError('ID es requerido para eliminar un movimiento');
      return {
        success: false,
        error: 'ID es requerido para eliminar un movimiento'
      };
    }

    try {
      setLoading(true);
      setError(null);
      
      await movementsApi.delete(id);
      
      setMovements(prevMovements => prevMovements.filter(m => m.id !== id));
      
      return { success: true };
    } catch (err) {
      console.error(`Error deleting movement ${id}:`, err);
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
   * Get movements by account number
   * @param {string} accountNumber - Account number
   * @returns {Promise<Array>} Array of movement objects
   */
  const getMovementsByAccountNumber = useCallback(async (accountNumber) => {
    if (!accountNumber) {
      setError('Número de cuenta es requerido');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      const movementsData = await movementsApi.getByAccountNumber(accountNumber);
      return movementsData.map(m => new Movement(m));
    } catch (err) {
      console.error(`Error getting movements for account ${accountNumber}:`, err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get movements by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of movement objects
   */
  const getMovementsByDateRange = useCallback(async (startDate, endDate) => {
    if (!startDate || !endDate) {
      setError('Fechas de inicio y fin son requeridas');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      const movementsData = await movementsApi.getByDateRange(startDate, endDate);
      return movementsData.map(m => new Movement(m));
    } catch (err) {
      console.error(`Error getting movements by date range:`, err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load movements on initial render
  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  return {
    movements,
    loading,
    error,
    loadMovements,
    getMovementById,
    createMovement,
    updateMovement,
    deleteMovement,
    getMovementsByAccountNumber,
    getMovementsByDateRange
  };
};