package com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "person")
@Getter
@Setter
public class PersonTable {

    @Id
    private String identification;
    private String name;
    private String gender;
    private Integer age;
    private String address;
    private String phone;
}

