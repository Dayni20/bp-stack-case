package com.bank.msa.bs.account.customer.api.application.port.input;

import com.bank.msa.bs.account.customer.api.domain.Customer;
import java.util.List;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer createCustomer(Customer customer);
    Customer updateCustomer(Integer customerId, Customer customer);
    void deleteCustomer(Integer customerId);
}
