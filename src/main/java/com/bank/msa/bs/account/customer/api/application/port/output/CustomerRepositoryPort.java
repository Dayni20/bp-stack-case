package com.bank.msa.bs.account.customer.api.application.port.output;

import com.bank.msa.bs.account.customer.api.domain.Customer;
import java.util.List;
import java.util.Optional;

public interface CustomerRepositoryPort {
    List<Customer> findAll();
    Optional<Customer> findById(String customerId);
    Customer save(Customer customer);
    void deleteById(String customerId);
}
