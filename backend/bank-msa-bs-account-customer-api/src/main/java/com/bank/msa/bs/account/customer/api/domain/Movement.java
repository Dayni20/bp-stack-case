package com.bank.msa.bs.account.customer.api.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Movement {
    private Integer movementId;
    private Integer accountId;
    private LocalDateTime date;
    private String movementType;
    private BigDecimal value;
    private BigDecimal availableBalance;
    private String accountNumber;
}