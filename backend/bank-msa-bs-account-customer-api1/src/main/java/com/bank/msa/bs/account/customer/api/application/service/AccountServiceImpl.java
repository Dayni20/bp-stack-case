package com.bank.msa.bs.account.customer.api.application.service;

import com.bank.msa.bs.account.customer.api.application.port.input.AccountService;
import com.bank.msa.bs.account.customer.api.application.port.output.AccountRepositoryPort;
import com.bank.msa.bs.account.customer.api.domain.Account;
import com.bank.msa.bs.account.customer.api.domain.exception.AccountNumberAlreadyExistsException;
import com.bank.msa.bs.account.customer.api.domain.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepositoryPort accountRepositoryPort;

    @Override
    public List<Account> getAllAccounts() {
        return accountRepositoryPort.findAll();
    }


    @Override
    public Account createAccount(Account account) {
        if (account.getAccountNumber() == null || account.getAccountNumber().isEmpty()) {
            account.setAccountNumber(generateUniqueAccountNumber());
        } else {
            if (accountRepositoryPort.findByAccountNumber(account.getAccountNumber()).isPresent()) {
                throw new AccountNumberAlreadyExistsException(account.getAccountNumber());
            }
        }
        Account savedAccount = accountRepositoryPort.save(account);
        return accountRepositoryPort.findById(savedAccount.getAccountId())
                .orElse(savedAccount);
    }
    
    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            accountNumber = String.valueOf(100000 + (int)(Math.random() * 900000));
        } while (accountRepositoryPort.findByAccountNumber(accountNumber).isPresent());
        
        return accountNumber;
    }

    @Override
    public Account updateAccount(Integer accountId, Account account) {
        Account existingAccount = accountRepositoryPort.findById(accountId)
                .orElseThrow(() -> new RuntimeException(String.format(Constants.ERR_ACCOUNT_NOT_FOUND_ID, accountId)));

        if (!existingAccount.getAccountNumber().equals(account.getAccountNumber())) {
            Optional<Account> duplicateAccount = accountRepositoryPort.findByAccountNumber(account.getAccountNumber());
            if (duplicateAccount.isPresent()) {
                throw new AccountNumberAlreadyExistsException(account.getAccountNumber());
            }
        }
        
        existingAccount.setAccountNumber(account.getAccountNumber());
        existingAccount.setAccountType(account.getAccountType());
        existingAccount.setInitialBalance(account.getInitialBalance());
        existingAccount.setStatus(account.getStatus());

        if (account.getCustomerName() != null) {
            existingAccount.setCustomerName(account.getCustomerName());
        }
        
        return accountRepositoryPort.save(existingAccount);
    }

    @Override
    public void deleteAccount(Integer accountId) {
        accountRepositoryPort.findById(accountId)
                .orElseThrow(() -> new RuntimeException(String.format(Constants.ERR_ACCOUNT_NOT_FOUND_ID, accountId)));
        accountRepositoryPort.deleteById(accountId);
    }
}