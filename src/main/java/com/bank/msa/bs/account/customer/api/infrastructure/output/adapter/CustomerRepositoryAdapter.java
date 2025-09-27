package com.bank.msa.bs.account.customer.api.infrastructure.output.adapter;

import com.bank.msa.bs.account.customer.api.application.port.output.CustomerRepositoryPort;
import com.bank.msa.bs.account.customer.api.domain.Customer;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.CustomerMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.CustomerJpaRepository;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.CustomerTable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CustomerRepositoryAdapter implements CustomerRepositoryPort {
    private final CustomerJpaRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public List<Customer> findAll() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Customer> findById(String customerId) {
        return customerRepository.findById(customerId)
                .map(customerMapper::toDomain);
    }

    @Override
    public Customer save(Customer customer) {
        CustomerTable entity = customerMapper.toEntity(customer);
        return customerMapper.toDomain(customerRepository.save(entity));
    }

    @Override
    public void deleteById(String customerId) {
        customerRepository.deleteById(customerId);
    }
}
