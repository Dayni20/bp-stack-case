package com.bank.msa.bs.account.customer.api.application.port.output;

import com.bank.msa.bs.account.customer.api.domain.Movement;

import java.util.List;
import java.util.Optional;

public interface MovementRepositoryPort {
    List<Movement> findAll();
    Optional<Movement> findById(Integer movementId);
    Movement save(Movement movement);
    void deleteById(Integer movementId);
    List<Movement> findByAccountId(Integer accountId);
}