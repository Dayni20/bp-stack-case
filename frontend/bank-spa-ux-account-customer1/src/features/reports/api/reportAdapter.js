/**
 * Report Adapter
 * Handles API communication for reports
 */

import { API_CONFIG } from '../../../shared/config';

/**
 * Processes HTTP response and handles common errors
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Result with success status and data or error
 */
const handleResponse = async (response) => {
  try {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || `Error: ${response.status} ${response.statusText}`
      };
    }

    if (response.status === 204) {
      return { success: true, data: null };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error processing response:', error);
    return { 
      success: false, 
      error: error.message || 'Error de red o servidor' 
    };
  }
};

/**
 * Fetch report data from the backend
 * @param {string} customerId - ID of the customer
 * @param {string} startDate - Start date for the report
 * @param {string} endDate - End date for the report
 * @returns {Promise<Object>} Report data with success status
 */
export const fetchReport = async (customerId, startDate, endDate) => {
  console.log('Fetching report data', { customerId, startDate, endDate });

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REPORTS}?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`, {
      method: 'GET',
      headers: API_CONFIG.HEADERS
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching report:', error);
    return {
      success: false,
      error: error.message || 'Error de red al intentar obtener el reporte'
    };
  }
};