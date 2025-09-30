package com.bank.msa.bs.account.customer.api.domain;

import lombok.*;

@Getter
@Setter
public class Account {
    private Integer accountId;
    private String accountNumber;
    private String accountType;
    private Double initialBalance;
    private Boolean status;
    private String customerId;
    private String customerName;
}
