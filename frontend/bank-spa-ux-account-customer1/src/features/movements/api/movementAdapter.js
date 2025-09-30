/**
 * Movement API Adapter
 * Feature: Movements
 * Handles all HTTP requests related to movement management
 */

import { API_CONFIG, ERROR_MESSAGES, logDebug } from '../../../shared/config';

/**
 * Processes HTTP response and handles common errors
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object|null>} Parsed JSON or null for 204 responses
 * @throws {Error} Formatted error message based on status code
 */
const handleResponse = async (response) => {
  console.log('[RESPONSE HANDLER] Status:', response.status, response.statusText);
  
  if (!response.ok) {
    let errorMessage;
    let responseText = '';
    
    try {
      // Intentar obtener el texto de la respuesta para diagnóstico
      responseText = await response.text();
      console.error('[RESPONSE HANDLER] Error response text:', responseText);
      
      // Intentar parsear como JSON si es posible
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || ERROR_MESSAGES.UNKNOWN;
      } catch (jsonError) {
        // No era JSON válido, usar el texto como está
        errorMessage = responseText || ERROR_MESSAGES.UNKNOWN;
      }
    } catch (e) {
      console.error('[RESPONSE HANDLER] Error reading response:', e);
      
      // Si no podemos leer la respuesta, usar mensajes estándar
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
    console.log('[RESPONSE HANDLER] 204 No Content response');
    return null;
  }
  
  try {
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    console.error('[RESPONSE HANDLER] Error parsing JSON:', e);
    return {};
  }
};

/**
 * Maps backend movement data format to frontend format
 * @param {Object} backendMovement - Movement data from API
 * @returns {Object} Formatted movement data for frontend
 */
const mapBackendToFrontend = (backendMovement) => {
  logDebug('Mapping backend movement data', backendMovement);
  
  if (!backendMovement) {
    console.error('[ADAPTER] Null or undefined backend movement data');
    return {};
  }
  
  // Búsqueda exhaustiva de ID en las propiedades del objeto
  let movementId = null;
  
  // Intentar extraer el ID de varias propiedades posibles en el orden de prioridad
  const idProperties = ['id', '_id', 'movementId', 'ID', 'Id'];
  for (const prop of idProperties) {
    if (backendMovement[prop] !== undefined && backendMovement[prop] !== null) {
      movementId = backendMovement[prop];
      console.log(`[ADAPTER] Found movement ID in backend data at property '${prop}': ${movementId}`);
      break;
    }
  }
  
  // Mapear fecha al formato esperado
  let formattedDate = backendMovement.date;
  
  // Si la fecha es un timestamp o string ISO, convertirlo a YYYY-MM-DD
  if (formattedDate && typeof formattedDate === 'string' && formattedDate.includes('T')) {
    formattedDate = formattedDate.split('T')[0];
  }
  
  // Construir el objeto con todos los datos disponibles
  const mappedMovement = {
    id: movementId,
    accountNumber: backendMovement.accountNumber || '',
    date: formattedDate || new Date().toISOString().split('T')[0],
    transactionType: backendMovement.transactionType || 'CREDIT',
    amount: backendMovement.amount !== undefined ? backendMovement.amount : 0,
    balance: typeof backendMovement.balance === 'number' ? backendMovement.balance : 0
  };
  
  logDebug('Mapped to frontend', mappedMovement);
  return mappedMovement;
};

/**
 * Maps frontend movement data to backend format
 * @param {Object} frontendMovement - Movement data from UI
 * @returns {Object} Formatted movement data for backend
 */
const mapFrontendToBackend = (frontendMovement) => {
  console.log('[ADAPTER] Mapping frontend movement to backend format:', frontendMovement);
  
  const data = {
    accountNumber: frontendMovement.accountNumber || '',
    date: frontendMovement.date || new Date().toISOString().split('T')[0],
    transactionType: frontendMovement.transactionType || 'CREDIT'
  };
  
  // Manejar el monto correctamente, asegurando que sea un número para el backend
  if (frontendMovement.amount !== undefined && frontendMovement.amount !== null) {
    if (typeof frontendMovement.amount === 'string') {
      const numAmount = parseFloat(frontendMovement.amount);
      data.amount = !isNaN(numAmount) ? numAmount : 0;
    } else if (typeof frontendMovement.amount === 'number') {
      data.amount = frontendMovement.amount;
    } else {
      data.amount = 0;
    }
  } else {
    data.amount = 0;
  }
  
  // Incluir balance si está disponible
  if (frontendMovement.balance !== undefined && frontendMovement.balance !== null) {
    data.balance = typeof frontendMovement.balance === 'number' ? 
                  frontendMovement.balance : 
                  parseFloat(frontendMovement.balance) || 0;
  }
  
  // Añadir ID si existe
  if (frontendMovement.id) {
    data.id = frontendMovement.id;
  }
  
  logDebug('Sending movement to backend', data);
  return data;
};

/**
 * Movement API service
 * Implementation based on Postman collection for movement management
 */
export const movementsApi = {
  /**
   * Get all movements
   * @returns {Promise<Array>} Array of movement objects mapped to frontend format
   * @throws {Error} Network or server errors
   */
  async getAll() {
    logDebug('Fetching all movements');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVEMENTS}`, {
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
      console.error('Error fetching movements:', error);
      
      // Handle CORS errors specifically
      if (error.message.includes('CORS') || error.message.includes('NetworkError')) {
        throw new Error(ERROR_MESSAGES.NETWORK);
      }
      
      throw error;
    }
  },
  
  /**
   * Get movement by ID
   * @param {string|number} id - Movement ID
   * @returns {Promise<Object>} Movement object
   * @throws {Error} Network or server errors
   */
  async getById(id) {
    if (!id) {
      throw new Error('ID es requerido para obtener un movimiento');
    }
    
    logDebug(`Fetching movement with ID: ${id}`);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVEMENTS}/${id}`, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });
      
      const backendData = await handleResponse(response);
      return mapBackendToFrontend(backendData);
    } catch (error) {
      console.error(`Error fetching movement ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new movement
   * @param {Object} movementData - Movement data
   * @returns {Promise<Object>} Created movement
   * @throws {Error} Network or server errors
   */
  async create(movementData) {
    logDebug('Creating movement with data:', movementData);
    
    try {
      const backendData = mapFrontendToBackend(movementData);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVEMENTS}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(backendData)
      });
      
      const createdMovement = await handleResponse(response);
      return mapBackendToFrontend(createdMovement);
    } catch (error) {
      console.error('Error creating movement:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing movement
   * @param {string|number} id - Movement ID
   * @param {Object} movementData - Updated movement data
   * @returns {Promise<Object>} Updated movement
   * @throws {Error} Network or server errors
   */
  async update(id, movementData) {
    if (!id) {
      throw new Error('ID es requerido para actualizar un movimiento');
    }
    
    logDebug(`Updating movement ${id} with data:`, movementData);
    
    try {
      // Asegurarse de que el ID se incluya en los datos
      const dataWithId = { ...movementData, id: id };
      const backendData = mapFrontendToBackend(dataWithId);
      
      console.log('Backend data for update:', backendData);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVEMENTS}/${id}`, {
        method: 'PUT',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(backendData)
      });
      
      const updatedMovement = await handleResponse(response);
      return mapBackendToFrontend(updatedMovement);
    } catch (error) {
      console.error(`Error updating movement ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a movement by ID
   * @param {string|number} id - Movement ID
   * @returns {Promise<boolean>} Success status
   * @throws {Error} Network or server errors
   */
  async delete(id) {
    if (!id) {
      throw new Error('ID es requerido para eliminar un movimiento');
    }
    
    logDebug(`Deleting movement with ID: ${id}`);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVEMENTS}/${id}`, {
        method: 'DELETE',
        headers: API_CONFIG.HEADERS,
      });
      
      if (response.status === 204) {
        return true;
      }
      
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error(`Error deleting movement ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get movements by account number
   * @param {string} accountNumber - Account number to filter by
   * @returns {Promise<Array>} Array of movement objects
   * @throws {Error} Network or server errors
   */
  async getByAccountNumber(accountNumber) {
    if (!accountNumber) {
      throw new Error('Número de cuenta es requerido');
    }
    
    logDebug(`Fetching movements for account: ${accountNumber}`);
    
    try {
      // Implementación actual - obtener todos y filtrar
      // Idealmente, el backend debería soportar un endpoint filtrado
      const allMovements = await this.getAll();
      return allMovements.filter(m => m.accountNumber === accountNumber);
    } catch (error) {
      console.error(`Error fetching movements for account ${accountNumber}:`, error);
      throw error;
    }
  },

  /**
   * Get movements by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of movement objects
   * @throws {Error} Network or server errors
   */
  async getByDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new Error('Fechas de inicio y fin son requeridas');
    }
    
    logDebug(`Fetching movements between ${startDate} and ${endDate}`);
    
    try {
      // Implementación básica - obtener todos y filtrar
      const allMovements = await this.getAll();
      
      return allMovements.filter(movement => {
        const movementDate = movement.date;
        return movementDate >= startDate && movementDate <= endDate;
      });
    } catch (error) {
      console.error(`Error fetching movements by date range:`, error);
      throw error;
    }
  }
};