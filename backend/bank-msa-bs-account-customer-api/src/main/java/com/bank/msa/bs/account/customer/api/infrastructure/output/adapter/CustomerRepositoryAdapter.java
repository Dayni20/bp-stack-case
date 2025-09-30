package com.bank.msa.bs.account.customer.api.infrastructure.output.adapter;

import com.bank.msa.bs.account.customer.api.application.port.output.CustomerRepositoryPort;
import com.bank.msa.bs.account.customer.api.domain.Customer;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.CustomerMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.CustomerJpaRepository;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.PersonJpaRepository;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.CustomerTable;
import com.bank.msa.bs.account.customer.api.infrastructure.output.security.PasswordHasher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CustomerRepositoryAdapter implements CustomerRepositoryPort {
    private final CustomerJpaRepository customerRepository;
    private final PersonJpaRepository personRepository;
    private final CustomerMapper customerMapper;
    private final PasswordHasher passwordHasher;

    @Override
    public List<Customer> findAll() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public java.util.Optional<Customer> findById(Integer customerId) {
        return customerRepository.findById(customerId)
                .map(customerMapper::toDomain);
    }

    @Override
    public Customer save(Customer customer) {
        CustomerTable entity = customerMapper.toEntity(customer);
        entity.setPassword(passwordHasher.hash(customer.getPassword()));
        var persistedPerson = personRepository.save(entity.getPerson());
        entity.setPerson(persistedPerson);
        CustomerTable saved = customerRepository.save(entity);
        return customerMapper.toDomain(saved);
    }

    @Override
    public Customer update(Integer customerId, Customer customer) {
        CustomerTable existing = customerRepository.getReferenceById(customerId);
        var person = existing.getPerson();
        person.setName(customer.getName());
        person.setAddress(customer.getAddress());
        person.setPhone(customer.getPhone());
        existing.setPassword(passwordHasher.hash(customer.getPassword()));
        existing.setStatus(customer.getStatus());
        CustomerTable updated = customerRepository.save(existing);
        return customerMapper.toDomain(updated);
    }

    @Override
    public void deleteById(Integer customerId) {
        customerRepository.deleteById(customerId);
    }
}
