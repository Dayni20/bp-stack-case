package com.bank.msa.bs.account.customer.api.application.service;

import com.bank.msa.bs.account.customer.api.application.port.input.CustomerService;
import com.bank.msa.bs.account.customer.api.domain.Customer;
import com.bank.msa.bs.account.customer.api.application.port.output.CustomerRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepositoryPort customerRepositoryPort;

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepositoryPort.findAll();
    }

    @Override
    public Customer getCustomerById(String customerId) {
        return customerRepositoryPort.findById(customerId).orElse(null);
    }

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepositoryPort.save(customer);
    }

    @Override
    public Customer updateCustomer(String customerId, Customer customer) {
        customer.setCustomerId(customerId);
        return customerRepositoryPort.save(customer);
    }

    @Override
    public void deleteCustomer(String customerId) {
        customerRepositoryPort.deleteById(customerId);
    }
}

