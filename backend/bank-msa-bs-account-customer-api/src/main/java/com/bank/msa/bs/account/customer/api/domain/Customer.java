package com.bank.msa.bs.account.customer.api.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Customer extends Person {
    private String customerId;
    private String password;
    private Boolean status;
}
