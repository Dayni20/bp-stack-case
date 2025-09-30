/**
 * Shared API Configuration
 * Central configuration for all API connections
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8081',
  DEBUG: true, // Enable console logging
  ENDPOINTS: {
    CUSTOMERS: '/customers',
    ACCOUNTS: '/accounts',
    MOVEMENTS: '/movements',
    REPORTS: '/reports'
  },
  HEADERS: {
    'Content-Type': 'application/json'
  },
  TIMEOUT: 10000 // 10 seconds timeout
};

// Common HTTP error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión: Verifica que el servidor esté disponible',
  SERVER: 'Error en el servidor',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION: 'Error de validación en los datos',
  UNKNOWN: 'Error desconocido',
  UNAUTHORIZED: 'No autorizado'
};

// Utility function to log API activity when debug is enabled
export const logDebug = (message, data) => {
  if (API_CONFIG.DEBUG) {
    console.log(`📡 [API] ${message}`, data || '');
  }
};