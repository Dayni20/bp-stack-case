package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.impl;

import com.bank.msa.bs.account.customer.api.application.port.input.AccountService;
import com.bank.msa.bs.account.customer.api.domain.Account;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.AccountsApi;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.AccountMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class AccountController implements AccountsApi {

    private final AccountMapper accountMapper;
    private final AccountService accountService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<AccountResponse> createAccount(AccountRequest accountRequest) {
        // Mapear request -> dominio
        Account account = accountMapper.toDomain(accountRequest);

        // Ejecutar caso de uso
        Account created = accountService.createAccount(account);

        // Mapear dominio -> response
        AccountResponse response = accountMapper.toResponse(created);

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> deleteAccount(String accountNumber) {
        accountService.deleteAccount(accountNumber);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<AccountResponse> getAccountByNumber(String accountNumber) {
        Account account = accountService.getAccountById(accountNumber);
        AccountResponse response = accountMapper.toResponse(account);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<List<AccountResponse>> listAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        List<AccountResponse> responses = accounts.stream()
                .map(accountMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @Override
    public ResponseEntity<AccountResponse> updateAccount(String accountNumber, AccountRequest accountRequest) {
        Account account = accountMapper.toDomain(accountRequest);
        Account updated = accountService.updateAccount(accountNumber, account);
        AccountResponse response = accountMapper.toResponse(updated);
        return ResponseEntity.ok(response);
    }
}
