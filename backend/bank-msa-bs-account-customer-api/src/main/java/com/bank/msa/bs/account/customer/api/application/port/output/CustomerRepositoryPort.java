package com.bank.msa.bs.account.customer.api.application.port.output;

import com.bank.msa.bs.account.customer.api.domain.Customer;
import java.util.List;

public interface CustomerRepositoryPort {
    List<Customer> findAll();
    java.util.Optional<Customer> findById(Integer customerId);
    Customer save(Customer customer);
    Customer update(Integer customerId, Customer customer);
    void deleteById(Integer customerId);
}
