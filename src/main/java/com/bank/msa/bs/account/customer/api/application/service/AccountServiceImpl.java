package com.bank.msa.bs.account.customer.api.application.service;

import com.bank.msa.bs.account.customer.api.application.port.input.AccountService;
import com.bank.msa.bs.account.customer.api.application.port.input.CustomerService;
import com.bank.msa.bs.account.customer.api.application.port.output.AccountRepositoryPort;
import com.bank.msa.bs.account.customer.api.application.port.output.CustomerRepositoryPort;
import com.bank.msa.bs.account.customer.api.domain.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepositoryPort accountRepositoryPort;

    @Override
    public List<Account> getAllAccounts() {
        return accountRepositoryPort.findAll();
    }

    @Override
    public Account getAccountById(String accountNumber) {
        return accountRepositoryPort.findById(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Override
    public Account createAccount(Account account) {
        return accountRepositoryPort.save(account);
    }

    @Override
    public Account updateAccount(String accountNumber, Account account) {
        account.setAccountNumber(accountNumber);
        return accountRepositoryPort.save(account);
    }

    @Override
    public void deleteAccount(String accountNumber) {
        accountRepositoryPort.deleteById(accountNumber);
    }
}