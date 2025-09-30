package com.bank.msa.bs.account.customer.api.application.service;

import com.bank.msa.bs.account.customer.api.application.port.input.ReportService;
import com.bank.msa.bs.account.customer.api.application.port.output.AccountRepositoryPort;
import com.bank.msa.bs.account.customer.api.application.port.output.CustomerRepositoryPort;
import com.bank.msa.bs.account.customer.api.application.port.output.MovementRepositoryPort;
import com.bank.msa.bs.account.customer.api.domain.Account;
import com.bank.msa.bs.account.customer.api.domain.Customer;
import com.bank.msa.bs.account.customer.api.domain.Movement;
import com.bank.msa.bs.account.customer.api.domain.exception.NotFoundException;
import com.bank.msa.bs.account.customer.api.domain.util.Constants;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.*;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportServiceImpl implements ReportService {

    private final CustomerRepositoryPort customerRepositoryPort;
    private final AccountRepositoryPort accountRepositoryPort;
    private final MovementRepositoryPort movementRepositoryPort;

    @Override
    public AccountStatement getAccountStatement(String customerId, LocalDate startDate, LocalDate endDate) {
        try {
            Customer customer = customerRepositoryPort.findById(Integer.valueOf(customerId))
                    .orElseThrow(() -> new NotFoundException(String.format(Constants.ERR_CLIENT_NOT_FOUND, customerId)));

            List<Account> customerAccounts = accountRepositoryPort.findByCustomerId(Integer.valueOf(customerId));
            if (customerAccounts.isEmpty()) {
                throw new NotFoundException(String.format(Constants.ERR_NO_ACCOUNTS_FOR_CLIENT, customerId));
            }

            AccountStatement statement = new AccountStatement();

            AccountStatementCustomer stmtCustomer = new AccountStatementCustomer();
            stmtCustomer.setCustomerId(customerId);
            stmtCustomer.setName(customer.getName());
            statement.setCustomer(stmtCustomer);

            AccountStatementDateRange dateRange = new AccountStatementDateRange();
            dateRange.setStart(startDate);
            dateRange.setEnd(endDate);
            statement.setDateRange(dateRange);

            List<AccountStatementAccountsInner> accounts = new ArrayList<>();
            for (Account account : customerAccounts) {
                AccountStatementAccountsInner accountInfo = new AccountStatementAccountsInner();
                accountInfo.setAccountNumber(account.getAccountNumber());
                accountInfo.setAccountType(account.getAccountType());
                accountInfo.setInitialBalance(account.getInitialBalance());

                List<Movement> movements = movementRepositoryPort.findByAccountId(account.getAccountId())
                        .stream()
                        .filter(movement -> {
                            LocalDate movementDate = movement.getDate().toLocalDate();
                            return !movementDate.isBefore(startDate) && !movementDate.isAfter(endDate);
                        })
                        .collect(Collectors.toList());

                List<AccountStatementAccountsInnerTransactionsInner> transactions = movements.stream()
                        .map(movement -> {
                            AccountStatementAccountsInnerTransactionsInner transaction =
                                new AccountStatementAccountsInnerTransactionsInner();
                            transaction.setDate(movement.getDate().toLocalDate());
                            transaction.setTransactionType(AccountStatementAccountsInnerTransactionsInner.TransactionTypeEnum.valueOf(movement.getMovementType()));
                            double amount = movement.getValue().doubleValue();
                            if ("DEBIT".equals(movement.getMovementType())) {
                                amount = -Math.abs(amount);
                            } else {
                                amount = Math.abs(amount);
                            }
                            transaction.setAmount(amount);
                            transaction.setAvailableBalance(movement.getAvailableBalance().doubleValue());
                            return transaction;
                        })
                        .collect(Collectors.toList());

                accountInfo.setTransactions(transactions);

                AccountStatementAccountsInnerTotals totals = new AccountStatementAccountsInnerTotals();
                double totalCredits = movements.stream()
                        .filter(m -> "CREDIT".equals(m.getMovementType()))
                        .mapToDouble(m -> m.getValue().doubleValue())
                        .sum();
                double totalDebits = movements.stream()
                        .filter(m -> "DEBIT".equals(m.getMovementType()))
                        .mapToDouble(m -> m.getValue().doubleValue())
                        .sum();
                totals.setTotalCredits(totalCredits);
                totals.setTotalDebits(totalDebits);
                accountInfo.setTotals(totals);
                accounts.add(accountInfo);
            }
            statement.setAccounts(accounts);

            byte[] pdfBytes = generatePdfWithiText(statement);
            statement.setPdfBase64(Base64.getEncoder().encodeToString(pdfBytes));

            return statement;
        } catch (Exception e) {
            throw new RuntimeException(String.format(Constants.ERR_REPORT_GENERATION, customerId, e.getMessage()), e);
        }
    }

    @Override
    public byte[] buildAccountStatementPdf(String customerId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating PDF directly for customer: {}, from: {} to: {}", customerId, startDate, endDate);
        try {
            AccountStatement statement = getAccountStatement(customerId, startDate, endDate);
            return generatePdfWithiText(statement);
        } catch (Exception e) {
            log.error("Error generating PDF for customer: {}", customerId, e);
            throw new RuntimeException(String.format(Constants.ERR_PDF_GENERATION, e.getMessage()));
        }
    }

    private byte[] generatePdfWithiText(AccountStatement statement) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            document.add(new Paragraph("ESTADO DE CUENTA BANCARIO")
                    .setFontSize(18)
                    .setBold());

            document.add(new Paragraph("Cliente: " + statement.getCustomer().getName())
                    .setFontSize(12));
            document.add(new Paragraph("ID Cliente: " + statement.getCustomer().getCustomerId())
                    .setFontSize(12));
            document.add(new Paragraph("Período: " + statement.getDateRange().getStart() +
                    " al " + statement.getDateRange().getEnd())
                    .setFontSize(12));

            document.add(new Paragraph("\n"));

            for (AccountStatementAccountsInner account : statement.getAccounts()) {
                document.add(new Paragraph("CUENTA: " + account.getAccountNumber() +
                        " (" + account.getAccountType() + ")")
                        .setFontSize(14)
                        .setBold());
                document.add(new Paragraph("Saldo Inicial: $" +
                        String.format("%.2f", account.getInitialBalance()))
                        .setFontSize(10));

                if (!account.getTransactions().isEmpty()) {
                    Table table = new Table(UnitValue.createPercentArray(4))
                            .setWidth(UnitValue.createPercentValue(100));

                    table.addHeaderCell("Fecha");
                    table.addHeaderCell("Tipo");
                    table.addHeaderCell("Monto");
                    table.addHeaderCell("Saldo");

                    for (AccountStatementAccountsInnerTransactionsInner tx : account.getTransactions()) {
                        table.addCell(tx.getDate().toString());
                        table.addCell(tx.getTransactionType().toString());
                        table.addCell("$" + String.format("%.2f", tx.getAmount()));
                        table.addCell("$" + String.format("%.2f", tx.getAvailableBalance()));
                    }

                    document.add(table);
                }

                document.add(new Paragraph("RESUMEN:")
                        .setFontSize(12)
                        .setBold());
                document.add(new Paragraph("Total Créditos: $" +
                        String.format("%.2f", account.getTotals().getTotalCredits()))
                        .setFontSize(10));
                document.add(new Paragraph("Total Débitos: $" +
                        String.format("%.2f", account.getTotals().getTotalDebits()))
                        .setFontSize(10));

                document.add(new Paragraph("\n"));
            }

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Error creating PDF with iText", e);
            throw new RuntimeException(Constants.ERR_FAILED_PDF, e);
        }
    }
}