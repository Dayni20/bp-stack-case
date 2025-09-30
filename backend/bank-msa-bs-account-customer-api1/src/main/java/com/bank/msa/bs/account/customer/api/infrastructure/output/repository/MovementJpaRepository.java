package com.bank.msa.bs.account.customer.api.infrastructure.output.repository;

import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.MovementTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovementJpaRepository extends JpaRepository<MovementTable, Integer> {
    
    @Query("SELECT m FROM MovementTable m JOIN FETCH m.account WHERE m.account.accountId = :accountId")
    List<MovementTable> findByAccount_AccountId(Integer accountId);
    
    @Query("SELECT m FROM MovementTable m JOIN FETCH m.account")
    List<MovementTable> findAll();
    
    @Query("SELECT m FROM MovementTable m JOIN FETCH m.account WHERE m.movementId = :movementId")
    Optional<MovementTable> findById(Integer movementId);
}