/**
 * Customer Hooks
 * Feature: Customers
 * React hooks for customer management operations
 */

import { useState, useEffect, useCallback } from 'react';
import { customersApi } from '../api/adapter';
import { Customer } from '../model/types';
import { logDebug } from '../../../shared/config';

/**
 * Main hook for customer management operations
 * @returns {Object} Customer operations and state
 */
export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load all customers from API
   */
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await customersApi.getAll();
      const customerInstances = data.map(c => new Customer(c));
      
      setCustomers(customerInstances);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new customer
   * @param {Object} customerData - Customer data from form
   * @returns {Object} Result with success status and customer data
   */
  const createCustomer = async (customerData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate data before sending to API
      const validation = Customer.validate(customerData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }
      
      const newCustomer = await customersApi.create(customerData);
      const customerInstance = new Customer(newCustomer);
      
      setCustomers(prev => [...prev, customerInstance]);
      return { success: true, customer: customerInstance };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing customer
   * @param {string|number} id - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Object} Result with success status and customer data
   */
  const updateCustomer = async (id, customerData) => {
    if (!id) {
      setError('ID de cliente es necesario para actualizar');
      return { success: false, error: 'ID de cliente es necesario para actualizar' };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate data before sending to API
      const validation = Customer.validate(customerData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }
      
      const updatedCustomer = await customersApi.update(id, customerData);
      const customerInstance = new Customer(updatedCustomer);
      
      setCustomers(prev => prev.map(c => c.id === id ? customerInstance : c));
      return { success: true, customer: customerInstance };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a customer
   * @param {string|number} id - Customer ID
   * @returns {Object} Result with success status
   */
  const deleteCustomer = async (id) => {
    console.log('[Delete Hook] Starting delete with ID:', id, 'Type:', typeof id);
    
    // Check if ID is valid and exists
    if (!id) {
      const errorMsg = 'ID de cliente es necesario para eliminar';
      console.error('[Delete Hook] No ID provided for deletion');
      setError(errorMsg);
      alert(errorMsg);
      return { success: false, error: errorMsg };
    }
    
    // Convert to string for consistent comparison
    const customerId = id.toString();
    
    // Find the customer to delete from our state to verify it exists
    const customerToDelete = customers.find(c => {
      if (!c.id) return false;
      return c.id.toString() === customerId;
    });
    
    // Log all customer IDs for debugging
    console.log('[Delete Hook] All customer IDs:', customers.map(c => ({ id: c.id, type: typeof c.id })));
    
    // Validate customer exists
    if (!customerToDelete) {
      console.error(`[Delete Hook] No customer found with ID ${customerId}`);
      const errorMsg = `No se encontró un cliente con ID ${customerId}`;
      setError(errorMsg);
      alert(errorMsg);
      return { success: false, error: errorMsg };
    }
    
    console.log('[Delete Hook] Found customer to delete:', customerToDelete);
    
    // Confirm deletion with user
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) {
      return { success: false, cancelled: true };
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('[Delete Hook] Calling API delete with ID:', customerId);
      const result = await customersApi.delete(customerId);
      
      if (result.success) {
        console.log('[Delete Hook] API delete successful for ID:', customerId);
        
        // Update state by removing the deleted customer
        setCustomers(prev => {
          console.log('[Delete Hook] Current customers before filter:', prev.length);
          const updated = prev.filter(c => c.id && c.id.toString() !== customerId);
          console.log('[Delete Hook] Remaining customers after filter:', updated.length);
          return updated;
        });
        
        return { success: true };
      } else {
        throw new Error('No se pudo eliminar el cliente');
      }
    } catch (err) {
      console.error('[Delete Hook] Error in deleteCustomer:', err);
      const errorMsg = err.message || 'Error al eliminar el cliente';
      setError(errorMsg);
      alert(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    loadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
};

/**
 * Hook to fetch and manage a single customer
 * @param {string|number} id - Customer ID
 * @returns {Object} Customer data, loading state, and error
 */
export const useCustomer = (id) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadCustomer = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await customersApi.getById(id);
        setCustomer(data ? new Customer(data) : null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  return { customer, loading, error };
};