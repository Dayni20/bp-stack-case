package com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "customer")
public class CustomerTable {

    @Id
    private String customerId;

    @OneToOne
    @JoinColumn(name = "identification", referencedColumnName = "identification")
    private PersonTable person;

    private String password;

    private Boolean status;
}
