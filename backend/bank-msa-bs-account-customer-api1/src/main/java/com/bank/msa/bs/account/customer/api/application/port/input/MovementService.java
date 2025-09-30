package com.bank.msa.bs.account.customer.api.application.port.input;

import com.bank.msa.bs.account.customer.api.domain.Movement;

import java.util.List;

public interface MovementService {
    List<Movement> getAllMovements();
    Movement getMovementById(Integer movementId);
    Movement createMovement(Movement movement);
    Movement updateMovement(Integer movementId, Movement movement);
    void deleteMovement(Integer movementId);
    List<Movement> getMovementsByAccountId(Integer accountId);
}