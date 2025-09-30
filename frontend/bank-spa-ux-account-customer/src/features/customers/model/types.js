/**
 * Customer Types & Validations
 * Feature: Customers
 * Based on the API schema from Postman collection
 */

/**
 * Constants for customer status
 */
export const CustomerStatus = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo'
};

/**
 * Customer model class with validation logic
 */
export class Customer {
  /**
   * Create a customer instance
   * @param {Object} data - Customer data 
   */
  constructor(data = {}) {
    // Explicitly handle ID with proper type checking
    if (typeof data.id === 'number') {
      this.id = data.id;
    } else if (typeof data.id === 'string' && data.id.trim() !== '') {
      this.id = data.id.trim();
    } else {
      // Fallback to phone number if no ID is available
      this.id = data.telefono ? `phone-${data.telefono}` : '';
      console.warn('No valid ID provided for customer, using fallback:', this.id);
    }
    
    this.nombre = data.nombre || '';
    this.direccion = data.direccion || '';
    this.telefono = data.telefono || '';
    this.contrasena = data.contrasena || '';
    this.estado = data.estado || CustomerStatus.ACTIVE;
  }

  /**
   * Validate customer data
   * @param {Object} data - Customer data to validate
   * @returns {Object} Validation result with isValid flag and errors
   */
  static validate(data) {
    const errors = {};
    
    // Name validation
    if (!data.nombre?.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (data.nombre.length > 100) {
      errors.nombre = 'El nombre no puede exceder 100 caracteres';
    }
    
    // Address validation
    if (!data.direccion?.trim()) {
      errors.direccion = 'La dirección es requerida';
    } else if (data.direccion.length > 200) {
      errors.direccion = 'La dirección no puede exceder 200 caracteres';
    }
    
    // Phone validation
    if (!data.telefono?.trim()) {
      errors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{7,15}$/.test(data.telefono.replace(/\D/g, ''))) {
      errors.telefono = 'Ingrese un número de teléfono válido (7-15 dígitos)';
    }

    // Password validation
    if (!data.contrasena?.trim()) {
      errors.contrasena = 'La contraseña es requerida';
    } else if (data.contrasena.length < 4) {
      errors.contrasena = 'La contraseña debe tener al menos 4 caracteres';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Format customer name for display
   * @returns {string} Formatted name
   */
  getDisplayName() {
    return this.nombre || 'Cliente sin nombre';
  }

  /**
   * Get status color for UI
   * @returns {string} CSS color class
   */
  getStatusColor() {
    return this.estado === CustomerStatus.ACTIVE ? 'success' : 'danger';
  }
  
  /**
   * Check if the customer is active
   * @returns {boolean} Active status
   */
  isActive() {
    return this.estado === CustomerStatus.ACTIVE;
  }
}