/**
 * Customer API Adapter
 * Feature: Customers
 * Handles all HTTP requests related to customer management
 */

import { API_CONFIG, ERROR_MESSAGES, logDebug } from '../../../shared/config';

/**
 * Processes HTTP response and handles common errors
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object|null>} Parsed JSON or null for 204 responses
 * @throws {Error} Formatted error message based on status code
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      // Try to get error details from response
      const errorData = await response.json();
      errorMessage = errorData.message || ERROR_MESSAGES.UNKNOWN;
    } catch (e) {
      // If parsing fails, use standard error based on status code
      switch(response.status) {
        case 400: errorMessage = ERROR_MESSAGES.VALIDATION; break;
        case 401: case 403: errorMessage = ERROR_MESSAGES.UNAUTHORIZED; break;
        case 404: errorMessage = ERROR_MESSAGES.NOT_FOUND; break;
        case 500: errorMessage = ERROR_MESSAGES.SERVER; break;
        default: errorMessage = `${ERROR_MESSAGES.UNKNOWN} (${response.status})`;
      }
    }
    throw new Error(errorMessage);
  }
  
  // Return null for 204 No Content
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

/**
 * Maps backend customer data format to frontend format
 * @param {Object} backendCustomer - Customer data from API
 * @returns {Object} Formatted customer data for frontend
 */
const mapBackendToFrontend = (backendCustomer) => {
  logDebug('Mapping backend data', backendCustomer);
  
  if (!backendCustomer) {
    console.error('Attempted to map null or undefined backend customer data');
    return null;
  }
  
  // Explicitly log all possible ID fields to debug the issue
  console.log('Backend customer ID fields:', {
    id: backendCustomer.id,
    customerId: backendCustomer.customerId,
    person_id: backendCustomer.person_id,
    _id: backendCustomer._id,
    allKeys: Object.keys(backendCustomer)
  });
  
  // Try to get the ID from any field that might contain it
  let customerId = null;
  
  // First check numeric ID - this seems to be what the backend is using based on Postman
  if (typeof backendCustomer.id === 'number' || /^\d+$/.test(backendCustomer.id)) {
    customerId = backendCustomer.id;
  } else if (backendCustomer.customerId) {
    customerId = backendCustomer.customerId;
  } else if (backendCustomer.person_id) {
    customerId = backendCustomer.person_id;
  } else if (backendCustomer._id) {
    customerId = backendCustomer._id;
  }
  
  // If we still don't have an ID, try to use any unique identifier
  if (!customerId && backendCustomer.phone) {
    // Use phone as a fallback ID
    customerId = `phone-${backendCustomer.phone}`;
    console.warn('Using phone number as fallback ID:', customerId);
  }
  
  console.log('Selected customer ID:', customerId);
  
  const mapped = {
    id: customerId,
    nombre: backendCustomer.name || '',
    direccion: backendCustomer.address || '',
    telefono: backendCustomer.phone || '',
    contrasena: backendCustomer.password || '',
    estado: backendCustomer.status ? 'Activo' : 'Inactivo'
  };
  
  logDebug('Mapped to frontend', mapped);
  return mapped;
};

/**
 * Maps frontend customer data to backend format
 * @param {Object} frontendCustomer - Customer data from UI
 * @returns {Object} Formatted customer data for backend
 */
const mapFrontendToBackend = (frontendCustomer) => {
  // Format data according to backend schema (from Postman collection)
  const data = {
    name: frontendCustomer.nombre || '',
    address: frontendCustomer.direccion || '',
    phone: frontendCustomer.telefono || '',
    password: frontendCustomer.contrasena || '',
    status: frontendCustomer.estado === 'Activo'
  };
  
  logDebug('Sending to backend', data);
  return data;
};

/**
 * Customer API service
 * Implementation based on Postman collection for customer management
 */
export const customersApi = {
  /**
   * Get all customers
   * @returns {Promise<Array>} Array of customer objects mapped to frontend format
   * @throws {Error} Network or server errors
   */
  async getAll() {
    logDebug('Fetching all customers');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMERS}`, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      
      const backendData = await handleResponse(response);
      
      // Map backend data to frontend format
      if (Array.isArray(backendData)) {
        return backendData.map(mapBackendToFrontend);
      }
      return [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      
      // Handle CORS errors specifically
      if (error.message.includes('CORS') || error.message.includes('NetworkError')) {
        throw new Error(ERROR_MESSAGES.NETWORK);
      }
      
      throw new Error(`Error al obtener clientes: ${error.message}`);
    }
  },

  /**
   * Get customer by ID
   * @param {string|number} id - Customer ID
   * @returns {Promise<Object|null>} Customer data or null if not found
   * @throws {Error} Network or server errors
   */
  async getById(id) {
    if (!id) {
      throw new Error('ID de cliente es requerido');
    }
    
    logDebug('Fetching customer by ID', id);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      
      const backendData = await handleResponse(response);
      return backendData ? mapBackendToFrontend(backendData) : null;
    } catch (error) {
      console.error('Error fetching customer by ID:', error);
      throw new Error(`Error al obtener cliente: ${error.message}`);
    }
  },

  /**
   * Create a new customer
   * @param {Object} customerData - Customer data from form
   * @returns {Promise<Object>} Created customer data
   * @throws {Error} Validation or server errors
   */
  async create(customerData) {
    logDebug('Creating new customer', customerData);
    
    try {
      // Validate required fields before sending to backend
      if (!customerData.nombre || !customerData.telefono) {
        throw new Error('Nombre y teléfono son requeridos');
      }
      
      const backendData = mapFrontendToBackend(customerData);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMERS}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(backendData)
      });
      
      const result = await handleResponse(response);
      return result ? mapBackendToFrontend(result) : null;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  },

  /**
   * Update an existing customer
   * @param {string|number} id - Customer ID to update
   * @param {Object} customerData - Updated customer data
   * @returns {Promise<Object>} Updated customer data
   * @throws {Error} Validation or server errors
   */
  async update(id, customerData) {
    if (!id) {
      throw new Error('ID de cliente es requerido para actualizar');
    }
    
    logDebug('Updating customer', { id, data: customerData });
    
    try {
      const backendData = mapFrontendToBackend(customerData);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`, {
        method: 'PUT',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(backendData)
      });
      
      const result = await handleResponse(response);
      return result ? mapBackendToFrontend(result) : null;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  },

  /**
   * Delete a customer
   * @param {string|number} id - Customer ID to delete
   * @returns {Promise<Object>} Success status object
   * @throws {Error} Server errors or invalid ID
   */
  async delete(id) {
    console.log('Delete API called with raw ID:', id, 'Type:', typeof id);
    
    // Try to get a valid customer ID for deletion
    let customerId = null;
    
    // If numeric or string representation of a number, use as is
    if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
      customerId = id;
    } 
    // Handle other string IDs (like phone-based IDs)
    else if (typeof id === 'string' && id.startsWith('phone-')) {
      // Extract the phone number and try to use that
      const phone = id.replace('phone-', '');
      customerId = phone;
      console.log('Using phone number for deletion:', phone);
    } 
    // Other string IDs
    else if (typeof id === 'string' && id.trim()) {
      customerId = id.trim();
    }
    
    // Final check - if we still don't have an ID, throw an error
    if (!customerId) {
      const errorMsg = 'No se puede eliminar este cliente porque no tiene un ID válido';
      console.error('Delete called with invalid ID:', id);
      throw new Error(errorMsg);
    }
    
    logDebug('Deleting customer with processed ID:', customerId);
    
    try {
      const deleteUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMERS}/${customerId}`;
      console.log('Delete URL:', deleteUrl);
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: API_CONFIG.HEADERS,
      });
      
      console.log('Delete response status:', response.status);
      
      // Handle both 204 No Content and 200 OK responses
      if (response.status === 204 || response.status === 200) {
        logDebug('Delete successful for ID:', customerId);
        return { success: true, deletedId: customerId };
      }
      
      // If 404, the customer wasn't found
      if (response.status === 404) {
        throw new Error('No se encontró el cliente para eliminar');
      }
      
      // For other statuses, try to get detailed error
      const result = await handleResponse(response);
      return result || { success: true };
    } catch (error) {
      console.error(`Error deleting customer with ID ${customerId}:`, error);
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }
};