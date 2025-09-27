package com.bank.msa.bs.account.customer.api.infrastructure.output.repository;

import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.AccountTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountJpaRepository extends JpaRepository<AccountTable, String> {
}
