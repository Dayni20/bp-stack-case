package com.bank.msa.bs.account.customer.api.domain.exception;

public class InsufficientFundsException extends BusinessException {
    public InsufficientFundsException(String message) {
        super("INSUFFICIENT_FUNDS", message);
    }
}
