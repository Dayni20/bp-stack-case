package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.impl;

import com.bank.msa.bs.account.customer.api.application.port.input.MovementService;
import com.bank.msa.bs.account.customer.api.domain.Movement;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.MovementsApi;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.MovementMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.TransactionRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class MovementController implements MovementsApi {

    private final MovementService movementService;
    private final MovementMapper movementMapper;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<TransactionResponse> createMovement(TransactionRequest transactionRequest) {
        Movement movement = movementMapper.toDomainFromCreate(transactionRequest);
        Movement created = movementService.createMovement(movement);
        TransactionResponse response = movementMapper.toResponse(created);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> deleteMovement(Integer movementId) {
        movementService.deleteMovement(movementId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<TransactionResponse> getMovementById(Integer movementId) {
        Movement movement = movementService.getMovementById(movementId);
        TransactionResponse response = movementMapper.toResponse(movement);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<List<TransactionResponse>> listMovements() {
        List<Movement> movements = movementService.getAllMovements();
        List<TransactionResponse> responses = movements.stream()
                .map(movementMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @Override
    public ResponseEntity<TransactionResponse> updateMovement(Integer movementId, TransactionRequest transactionRequest) {
        Movement movement = movementMapper.toDomainFromUpdate(transactionRequest);
        Movement updated = movementService.updateMovement(movementId, movement);
        TransactionResponse response = movementMapper.toResponse(updated);
        return ResponseEntity.ok(response);
    }
}