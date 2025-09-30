package com.bank.msa.bs.account.customer.api.domain.exception;

public class AccountNumberAlreadyExistsException extends RuntimeException {
    public AccountNumberAlreadyExistsException(String accountNumber) {
        super("Account number already exists: " + accountNumber);
    }
}