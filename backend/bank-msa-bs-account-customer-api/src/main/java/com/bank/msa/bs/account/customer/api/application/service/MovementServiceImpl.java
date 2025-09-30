package com.bank.msa.bs.account.customer.api.application.service;

import com.bank.msa.bs.account.customer.api.application.port.input.MovementService;
import com.bank.msa.bs.account.customer.api.application.port.output.MovementRepositoryPort;
import com.bank.msa.bs.account.customer.api.application.port.output.AccountRepositoryPort;
import com.bank.msa.bs.account.customer.api.domain.Movement;
import com.bank.msa.bs.account.customer.api.domain.Account;
import com.bank.msa.bs.account.customer.api.domain.exception.ResourceNotFoundException;
import com.bank.msa.bs.account.customer.api.domain.exception.ValidationException;
import com.bank.msa.bs.account.customer.api.domain.exception.InsufficientFundsException;
import com.bank.msa.bs.account.customer.api.domain.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovementServiceImpl implements MovementService {

    private final MovementRepositoryPort movementRepositoryPort;
    private final AccountRepositoryPort accountRepositoryPort;

    @Override
    public List<Movement> getAllMovements() {
        return movementRepositoryPort.findAll();
    }

    @Override
    public Movement getMovementById(Integer movementId) {
        return movementRepositoryPort.findById(movementId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(Constants.ERR_MOVEMENT_NOT_FOUND, movementId)));
    }

    @Override
    public Movement createMovement(Movement movement) {
        if (movement.getAccountId() == null && movement.getAccountNumber() != null) {
            Account account = accountRepositoryPort.findByAccountNumber(movement.getAccountNumber())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format(Constants.ERR_ACCOUNT_NOT_FOUND_NUMBER, movement.getAccountNumber())));
            movement.setAccountId(account.getAccountId());
        }
        
        Account account = accountRepositoryPort.findById(movement.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format(Constants.ERR_ACCOUNT_NOT_FOUND_ID, movement.getAccountId())));

        if (movement.getDate() == null) {
            movement.setDate(LocalDateTime.now());
        }
        
        BigDecimal currentBalance = getCurrentAccountBalance(movement.getAccountId());
        BigDecimal newBalance;
        
        if ("CREDIT".equals(movement.getMovementType())) {
            newBalance = currentBalance.add(movement.getValue());
        } else if ("DEBIT".equals(movement.getMovementType())) {
            newBalance = currentBalance.subtract(movement.getValue());
            
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientFundsException(String.format(Constants.ERR_INSUFFICIENT_FUNDS, currentBalance));
            }
        } else {
            throw new ValidationException(Constants.ERR_INVALID_MOVEMENT_TYPE);
        }
        
        movement.setAvailableBalance(newBalance);
        
        Movement savedMovement = movementRepositoryPort.save(movement);
        
        return movementRepositoryPort.findById(savedMovement.getMovementId())
                .orElseThrow(() -> new ResourceNotFoundException("Error retrieving saved movement"));
    }

    @Override
    public Movement updateMovement(Integer movementId, Movement movement) {
        Movement existingMovement = movementRepositoryPort.findById(movementId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(Constants.ERR_MOVEMENT_NOT_FOUND, movementId)));
        Account account = accountRepositoryPort.findById(existingMovement.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format(Constants.ERR_ACCOUNT_NOT_FOUND_ID, existingMovement.getAccountId())));

        existingMovement.setDate(movement.getDate());
        existingMovement.setMovementType(movement.getMovementType());
        existingMovement.setValue(movement.getValue());
        
        BigDecimal initialBalance = BigDecimal.valueOf(account.getInitialBalance());
        BigDecimal newBalance;
        if ("CREDIT".equals(existingMovement.getMovementType())) {
            newBalance = initialBalance.add(existingMovement.getValue());
        } else {
            newBalance = initialBalance.subtract(existingMovement.getValue());
        }
        existingMovement.setAvailableBalance(newBalance);
        
        Movement savedMovement = movementRepositoryPort.save(existingMovement);
        
        return movementRepositoryPort.findById(savedMovement.getMovementId())
                .orElseThrow(() -> new ResourceNotFoundException("Error retrieving updated movement"));
    }

    @Override
    public void deleteMovement(Integer movementId) {
        Movement existingMovement = movementRepositoryPort.findById(movementId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format(Constants.ERR_MOVEMENT_NOT_FOUND, movementId)));

        movementRepositoryPort.deleteById(movementId);
    }

    @Override
    public List<Movement> getMovementsByAccountId(Integer accountId) {
        return movementRepositoryPort.findByAccountId(accountId);
    }
    
    private BigDecimal getCurrentAccountBalance(Integer accountId) {
        List<Movement> movements = movementRepositoryPort.findByAccountId(accountId);
        if (movements.isEmpty()) {
            Account account = accountRepositoryPort.findById(accountId)
                    .orElseThrow(() -> new ResourceNotFoundException(Constants.ERR_ACCOUNT_NOT_FOUND_ID));
            return BigDecimal.valueOf(account.getInitialBalance());
        } else {
            return movements.get(movements.size() - 1).getAvailableBalance();
        }
    }
}