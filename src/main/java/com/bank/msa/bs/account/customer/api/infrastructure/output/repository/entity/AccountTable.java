package com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "account")
@Data
public class AccountTable {

    @Id
    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "account_type", nullable = false)
    private String accountType;

    @Column(name = "initial_balance", nullable = false)
    private BigDecimal initialBalance;

    @Column(name = "status", nullable = false)
    private Boolean status;

    @Column(name = "customer_id", nullable = false)
    private String customerId;
}
