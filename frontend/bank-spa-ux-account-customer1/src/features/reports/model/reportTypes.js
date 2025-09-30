/**
 * Report Types
 * Type definitions and classes for reports
 */

/**
 * Report class for handling report data
 */
export class Report {
    constructor({ id, customerId, startDate, endDate, data }) {
        this.id = id;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.data = data;
    }

    /**
     * Format report data for display
     * @returns {Object} Formatted report data
     */
    formatData() {
        return {
            id: this.id,
            customerId: this.customerId,
            startDate: new Date(this.startDate).toLocaleDateString(),
            endDate: new Date(this.endDate).toLocaleDateString(),
            data: this.data
        };
    }

    /**
     * Validate report data
     * @returns {boolean} True if valid, false otherwise
     */
    isValid() {
        const isDateValid = (date) => !isNaN(new Date(date).getTime());
        return (
            this.customerId &&
            isDateValid(this.startDate) &&
            isDateValid(this.endDate) &&
            Array.isArray(this.data)
        );
    }
}