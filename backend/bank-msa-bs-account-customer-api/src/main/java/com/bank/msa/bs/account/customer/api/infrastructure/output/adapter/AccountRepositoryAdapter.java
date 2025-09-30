package com.bank.msa.bs.account.customer.api.infrastructure.output.adapter;

import com.bank.msa.bs.account.customer.api.application.port.output.AccountRepositoryPort;
import com.bank.msa.bs.account.customer.api.domain.Account;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.AccountMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.AccountJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AccountRepositoryAdapter implements AccountRepositoryPort {

    private final AccountJpaRepository repository;
    private final AccountMapper accountMapper;

    @Override
    public List<Account> findAll() {
        return repository.findAllWithCustomerAndPerson().stream()
                .map(accountMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Account> findById(Integer accountId) {
        return repository.findById(accountId)
                .map(accountMapper::toDomain);
    }

    @Override
    public Optional<Account> findByAccountNumber(String accountNumber) {
        return repository.findByAccountNumber(accountNumber)
                .map(accountMapper::toDomain);
    }

    @Override
    public Account save(Account account) {
        return accountMapper.toDomain(
                repository.save(accountMapper.toEntity(account))
        );
    }

    @Override
    public List<Account> findByCustomerId(Integer customerId) {
        return repository.findByCustomerId(customerId).stream()
                .map(accountMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Integer accountId) {
        repository.deleteById(accountId);
    }
}