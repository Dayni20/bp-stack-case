package com.bank.msa.bs.account.customer.api.application.port.input;

import com.bank.msa.bs.account.customer.api.domain.Customer;
import java.util.List;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer getCustomerById(String customerId);
    Customer createCustomer(Customer customer);
    Customer updateCustomer(String customerId, Customer customer);
    void deleteCustomer(String customerId);
}
