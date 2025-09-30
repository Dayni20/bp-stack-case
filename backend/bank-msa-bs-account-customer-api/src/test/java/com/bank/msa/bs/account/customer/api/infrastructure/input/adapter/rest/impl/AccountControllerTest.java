package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.impl;

import com.bank.msa.bs.account.customer.api.application.port.input.AccountService;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.AccountMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountCreateRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountResponse;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AccountControllerTest {
    @Mock
    private AccountMapper accountMapper;
    @Mock
    private AccountService accountService;
    @InjectMocks
    private AccountController accountController;

    @Test
    void testCreateAccount() {
        AccountCreateRequest request = new AccountCreateRequest();
        var domain = new com.bank.msa.bs.account.customer.api.domain.Account();
        var response = new AccountResponse();
        when(accountMapper.toDomainFromCreate(request)).thenReturn(domain);
        when(accountService.createAccount(domain)).thenReturn(domain);
        when(accountMapper.toResponse(domain)).thenReturn(response);
        ResponseEntity<AccountResponse> result = accountController.createAccount(request);
        assertEquals(200, result.getStatusCodeValue());
        assertEquals(response, result.getBody());
    }

    @Test
    void testListAccounts() {
        when(accountService.getAllAccounts()).thenReturn(Collections.emptyList());
        ResponseEntity<List<AccountResponse>> result = accountController.listAccounts();
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
    }
}
