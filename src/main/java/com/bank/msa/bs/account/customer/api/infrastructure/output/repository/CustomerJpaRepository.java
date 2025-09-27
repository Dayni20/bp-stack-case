package com.bank.msa.bs.account.customer.api.infrastructure.output.repository;

import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.CustomerTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerJpaRepository extends JpaRepository<CustomerTable, String> {
}
