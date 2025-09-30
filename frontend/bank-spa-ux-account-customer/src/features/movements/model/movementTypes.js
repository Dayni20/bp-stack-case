export const MovementTypes = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT'
};

export class Movement {
  constructor(data = {}) {
    if (data.id !== undefined && data.id !== null) {
      if (typeof data.id === 'number') {
        this.id = data.id;
        console.log(`[MOVEMENT MODEL] Created with numeric ID: ${this.id}`);
      } else if (typeof data.id === 'string') {
        const trimmedId = data.id.trim();
        if (trimmedId !== '' && trimmedId !== 'null' && trimmedId !== 'undefined') {
          this.id = trimmedId;
          console.log(`[MOVEMENT MODEL] Created with string ID: ${this.id}`);
        } else {
          this.id = null;
          console.log(`[MOVEMENT MODEL] Rejected invalid string ID: "${data.id}"`);
        }
      }
    } else {
      this.id = null;
      console.log(`[MOVEMENT MODEL] Created without ID`);
    }
    
    const currentDate = this.getCurrentDate();
    console.log(`[MOVEMENT MODEL] Current date is: ${currentDate}`);
    
    this.accountNumber = data.accountNumber || '';
    this.date = data.date || currentDate;
    this.transactionType = data.transactionType || MovementTypes.CREDIT;
    
    if (data.amount === undefined || data.amount === null || data.amount === '') {
      this.amount = ''; 
    } else {
      const numAmount = parseFloat(data.amount);
      this.amount = isNaN(numAmount) ? 0 : numAmount;
    }
    
    this.balance = typeof data.balance === 'number' ? data.balance : 0;
  }

  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    
    return `${year}-${month}-${day}`;
  }

  validate() {
    const errors = {};

    if (!this.accountNumber) {
      errors.accountNumber = 'El número de cuenta es requerido';
    }

    if (!this.date) {
      errors.date = 'La fecha es requerida';
    } else {
      // Validar que la fecha esté en formato correcto (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(this.date)) {
        errors.date = 'El formato de fecha debe ser AAAA-MM-DD';
      }
    }

    if (!this.transactionType) {
      errors.transactionType = 'El tipo de transacción es requerido';
    }

    if (this.amount === undefined || this.amount === null || this.amount === '') {
      errors.amount = 'El monto es requerido';
    } else if (parseFloat(this.amount) <= 0) {
      errors.amount = 'El monto debe ser mayor que cero';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Métodos de utilidad para UI

  isCredit() {
    return this.transactionType === MovementTypes.CREDIT;
  }

  isDebit() {
    return this.transactionType === MovementTypes.DEBIT;
  }

  getFormattedAmount() {
    const amount = typeof this.amount === 'number' ? this.amount : parseFloat(this.amount) || 0;
    return new Intl.NumberFormat('es-EC', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  }

  getFormattedDate() {
    if (!this.date) return 'N/A';
    
    const [year, month, day] = this.date.split('-');
    return `${day}/${month}/${year}`;
  }

  getFormattedBalance() {
    return new Intl.NumberFormat('es-EC', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(this.balance);
  }

  getTransactionTypeName() {
    return this.isCredit() ? 'Depósito' : 'Retiro';
  }

  getTransactionTypeColor() {
    return this.isCredit() ? 'success' : 'warning';
  }
}