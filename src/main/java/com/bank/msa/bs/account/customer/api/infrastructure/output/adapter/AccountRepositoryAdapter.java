package com.bank.msa.bs.account.customer.api.infrastructure.output.adapter;

import com.bank.msa.bs.account.customer.api.application.port.output.AccountRepositoryPort;
import com.bank.msa.bs.account.customer.api.domain.Account;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.AccountMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.AccountJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AccountRepositoryAdapter implements AccountRepositoryPort {

private final AccountJpaRepository repository;

private final  AccountMapper accountMapper;
@Override
public List<Account> findAll() {
    return repository.findAll().stream()
            .map(accountMapper::toDomain)
            .collect(Collectors.toList());
}

@Override
public Optional<Account> findById(String accountNumber) {
    return repository.findById(accountNumber)
            .map(accountMapper::toDomain);
}

@Override
public Account save(Account account) {
    return accountMapper.toDomain(
            repository.save(accountMapper.toEntity(account))
    );
}

@Override
public void deleteById(String accountNumber) {
    repository.deleteById(accountNumber);
}
}