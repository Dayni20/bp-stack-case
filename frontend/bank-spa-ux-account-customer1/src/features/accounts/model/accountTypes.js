export const AccountTypes = {
  SAVINGS: 'SAVINGS',
  CHECKING: 'CHECKING',
  LOAN: 'LOAN',
  CREDIT: 'CREDIT'
};

export class Account {
  constructor(data = {}) {
    if (data.id !== undefined && data.id !== null) {
      if (typeof data.id === 'number') {
        this.id = data.id;
        console.log(`[ACCOUNT MODEL] Created with numeric ID: ${this.id}`);
      } else if (typeof data.id === 'string') {
        const trimmedId = data.id.trim();
        if (trimmedId !== '' && trimmedId !== 'null' && trimmedId !== 'undefined') {
          this.id = trimmedId;
          console.log(`[ACCOUNT MODEL] Created with string ID: ${this.id}`);
        } else {
          this.id = null;
          console.log(`[ACCOUNT MODEL] Rejected invalid string ID: "${data.id}"`);
        }
      } else {
        this.id = null;
        console.log(`[ACCOUNT MODEL] Rejected ID of unsupported type: ${typeof data.id}`);
      }
    } else {
      this.id = null;
      console.log('[ACCOUNT MODEL] Created without ID (new account)');
    }
    
    this._originalId = data.id;
    
    this.accountNumber = data.accountNumber || '';
    this.accountType = data.accountType || AccountTypes.SAVINGS;
    this.initialBalance = typeof data.initialBalance === 'number' ? data.initialBalance : 0;
    this.status = typeof data.status === 'boolean' ? data.status : true;
    this.customerId = data.customerId || '';
    this.customerName = data.customerName || '';
  }

  validate() {
    const errors = {};

    if (!this.accountNumber) {
      errors.accountNumber = 'El número de cuenta es requerido';
    }

    if (!this.accountType) {
      errors.accountType = 'El tipo de cuenta es requerido';
    }

    if (this.initialBalance === null || this.initialBalance === undefined) {
      errors.initialBalance = 'El saldo inicial es requerido';
    }

    if (!this.customerId) {
      errors.customerId = 'El cliente es requerido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  getFormattedAccountNumber() {
    if (!this.accountNumber) return 'N/A';
    
    return this.accountNumber;
  }

  getFormattedBalance() {
    return new Intl.NumberFormat('es-EC', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(this.initialBalance);
  }

  getAccountTypeName() {
    switch (this.accountType) {
      case AccountTypes.SAVINGS:
        return 'Ahorros';
      case AccountTypes.CHECKING:
        return 'Corriente';
      case AccountTypes.LOAN:
        return 'Préstamo';
      case AccountTypes.CREDIT:
        return 'Crédito';
      default:
        return this.accountType;
    }
  }

  getStatusText() {
    return this.status ? 'Activa' : 'Inactiva';
  }

  getStatusColor() {
    return this.status ? 'success' : 'danger';
  }
}