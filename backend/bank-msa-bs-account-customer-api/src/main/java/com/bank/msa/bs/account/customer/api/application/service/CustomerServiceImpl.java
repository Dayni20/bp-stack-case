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
    public Customer createCustomer(Customer customer) {
    return customerRepositoryPort.save(customer);
    }

    @Override
    public Customer updateCustomer(Integer customerId, Customer customer) {
        return customerRepositoryPort.update(customerId, customer);
    }
    @Override
    public void deleteCustomer(Integer customerId) {
        customerRepositoryPort.deleteById(customerId);
    }
}
