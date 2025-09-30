package com.bank.msa.bs.account.customer.api.infrastructure.output.adapter;

import com.bank.msa.bs.account.customer.api.application.port.output.MovementRepositoryPort;
import com.bank.msa.bs.account.customer.api.domain.Movement;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.MovementJpaRepository;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.MovementTable;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.mapper.MovementEntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MovementRepositoryAdapter implements MovementRepositoryPort {

    private final MovementJpaRepository movementJpaRepository;
    private final MovementEntityMapper movementEntityMapper;

    @Override
    public List<Movement> findAll() {
        return movementJpaRepository.findAll()
                .stream()
                .map(movementEntityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Movement> findById(Integer movementId) {
        return movementJpaRepository.findById(movementId)
                .map(movementEntityMapper::toDomain);
    }

    @Override
    public Movement save(Movement movement) {
        MovementTable entity = movementEntityMapper.toEntity(movement);
        MovementTable saved = movementJpaRepository.save(entity);
        return movementEntityMapper.toDomain(saved);
    }

    @Override
    public void deleteById(Integer movementId) {
        movementJpaRepository.deleteById(movementId);
    }

    @Override
    public List<Movement> findByAccountId(Integer accountId) {
        return movementJpaRepository.findByAccount_AccountId(accountId)
                .stream()
                .map(movementEntityMapper::toDomain)
                .collect(Collectors.toList());
    }
}