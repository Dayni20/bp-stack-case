package com.bank.msa.bs.account.customer.api.domain.util;

public class Constants {
    public static final String ERR_MOVEMENT_NOT_FOUND = "Movement not found with ID: %s";
    public static final String ERR_ACCOUNT_NOT_FOUND_ID = "Account not found with ID: %s";
    public static final String ERR_ACCOUNT_NOT_FOUND_NUMBER = "Account not found with number: %s";
    public static final String ERR_INSUFFICIENT_FUNDS = "Insufficient funds. Available balance: %s";
    public static final String ERR_INVALID_MOVEMENT_TYPE = "Invalid movement type. Must be CREDIT or DEBIT";
    public static final String ERR_ACCOUNT_ALREADY_EXISTS = "Account number already exists: %s";
    public static final String ERR_CLIENT_NOT_FOUND = "Cliente no encontrado con ID: %s";
    public static final String ERR_NO_ACCOUNTS_FOR_CLIENT = "No se encontraron cuentas para el cliente: %s";
    public static final String ERR_REPORT_GENERATION = "Error generando reporte para cliente %s: %s";
    public static final String ERR_PDF_GENERATION = "Error generating PDF: %s";
    public static final String ERR_FAILED_PDF = "Failed to generate PDF";
}
