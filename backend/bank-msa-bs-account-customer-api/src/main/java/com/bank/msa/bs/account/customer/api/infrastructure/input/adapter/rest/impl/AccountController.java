package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.impl;

import com.bank.msa.bs.account.customer.api.application.port.input.AccountService;
import com.bank.msa.bs.account.customer.api.domain.Account;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.AccountsApi;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.AccountMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountCreateRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountUpdateRequest;
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
    public ResponseEntity<AccountResponse> createAccount(AccountCreateRequest accountCreateRequest) {
        Account account = accountMapper.toDomainFromCreate(accountCreateRequest);

        Account created = accountService.createAccount(account);

        AccountResponse response = accountMapper.toResponse(created);

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> deleteAccount(Integer accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.noContent().build();
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
    public ResponseEntity<AccountResponse> updateAccount(Integer accountId, AccountUpdateRequest accountUpdateRequest) {
        Account account = accountMapper.toDomainFromUpdate(accountUpdateRequest);
        Account updated = accountService.updateAccount(accountId, account);
        AccountResponse response = accountMapper.toResponse(updated);
        return ResponseEntity.ok(response);
    }
}
