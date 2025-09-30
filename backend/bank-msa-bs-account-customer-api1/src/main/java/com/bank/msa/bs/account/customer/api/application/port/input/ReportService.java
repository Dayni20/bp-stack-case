package com.bank.msa.bs.account.customer.api.application.port.input;

import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountStatement;

import java.time.LocalDate;

public interface ReportService {
    AccountStatement getAccountStatement(String customerId, LocalDate startDate, LocalDate endDate);
    byte[] buildAccountStatementPdf(String customerId, LocalDate startDate, LocalDate endDate);
}