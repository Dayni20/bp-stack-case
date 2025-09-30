package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.impl;

import com.bank.msa.bs.account.customer.api.application.port.input.MovementService;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.MovementMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.TransactionRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.TransactionResponse;
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
class MovementControllerTest {
    @Mock
    private MovementMapper movementMapper;
    @Mock
    private MovementService movementService;
    @InjectMocks
    private MovementController movementController;

    @Test
    void testCreateMovement() {
        TransactionRequest request = new TransactionRequest();
        var domain = new com.bank.msa.bs.account.customer.api.domain.Movement();
        var response = new TransactionResponse();
        when(movementMapper.toDomainFromCreate(request)).thenReturn(domain);
        when(movementService.createMovement(domain)).thenReturn(domain);
        when(movementMapper.toResponse(domain)).thenReturn(response);
        ResponseEntity<TransactionResponse> result = movementController.createMovement(request);
        assertEquals(200, result.getStatusCodeValue());
        assertEquals(response, result.getBody());
    }

    @Test
    void testGetAllMovements() {
        when(movementService.getAllMovements()).thenReturn(Collections.emptyList());
        ResponseEntity<List<TransactionResponse>> result = movementController.listMovements();
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
    }
}
