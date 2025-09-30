package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.impl;

import com.bank.msa.bs.account.customer.api.application.port.input.ReportService;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.ReportsApi;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountStatement;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class ReportController implements ReportsApi {

    private final ReportService reportService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    @Override
    public ResponseEntity<AccountStatement> getAccountStatement(String customerId, LocalDate startDate, LocalDate endDate) {
        AccountStatement statement = reportService.getAccountStatement(customerId, startDate, endDate);
        return ResponseEntity.ok(statement);
    }

    @Override
    public ResponseEntity<Resource> downloadAccountStatementPdf(String customerId, LocalDate startDate, LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("endDate must be on or after startDate");
        }

        byte[] pdfBytes = reportService.buildAccountStatementPdf(customerId, startDate, endDate);
        
        String fileName = String.format("account_statement_%s_%s_%s.pdf", 
            customerId, startDate, endDate);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(
            ContentDisposition.inline().filename(fileName, StandardCharsets.UTF_8).build()
        );
        headers.setCacheControl(CacheControl.noCache());

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfBytes.length)
                .body(new ByteArrayResource(pdfBytes));
    }
}