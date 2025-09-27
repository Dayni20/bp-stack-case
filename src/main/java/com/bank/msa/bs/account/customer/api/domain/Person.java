package com.bank.msa.bs.account.customer.api.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Person {
    private String identification;
    private String name;
    private String gender;
    private int age;
    private String address;
    private String phone;
}
