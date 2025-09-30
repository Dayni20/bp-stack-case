package com.bank.msa.bs.account.customer.api.infrastructure.output.repository;

import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.PersonTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonJpaRepository extends JpaRepository<PersonTable, Integer> {
}
