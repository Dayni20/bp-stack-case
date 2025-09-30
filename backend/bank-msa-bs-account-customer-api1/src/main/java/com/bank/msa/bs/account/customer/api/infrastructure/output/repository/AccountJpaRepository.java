package com.bank.msa.bs.account.customer.api.infrastructure.output.repository;

import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.AccountTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountJpaRepository extends JpaRepository<AccountTable, Integer> {
    @Query("SELECT a FROM AccountTable a JOIN FETCH a.customer c JOIN FETCH c.person WHERE a.accountId = :accountId")
    java.util.Optional<AccountTable> findById(@Param("accountId") Integer accountId);
    
    @Query("SELECT a FROM AccountTable a JOIN FETCH a.customer c JOIN FETCH c.person WHERE a.accountNumber = :accountNumber")
    java.util.Optional<AccountTable> findByAccountNumber(@Param("accountNumber") String accountNumber);
    
    @Query("SELECT a FROM AccountTable a JOIN FETCH a.customer c JOIN FETCH c.person")
    java.util.List<AccountTable> findAllWithCustomerAndPerson();
    
    @Query("SELECT a FROM AccountTable a JOIN FETCH a.customer c JOIN FETCH c.person WHERE c.customerId = :customerId")
    java.util.List<AccountTable> findByCustomerId(@Param("customerId") Integer customerId);
}
