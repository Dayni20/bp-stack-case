package com.bank.msa.bs.account.customer.api.application.port.output;

import com.bank.msa.bs.account.customer.api.domain.Account;

import java.util.List;
import java.util.Optional;

public interface AccountRepositoryPort {
    List<Account> findAll();
    Optional<Account> findById(Integer accountId);
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByCustomerId(Integer customerId);
    Account save(Account account);
    void deleteById(Integer accountId);
}
