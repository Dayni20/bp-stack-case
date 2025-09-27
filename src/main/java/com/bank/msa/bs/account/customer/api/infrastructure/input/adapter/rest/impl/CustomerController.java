package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.impl;

import com.bank.msa.bs.account.customer.api.application.port.input.CustomerService;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.CustomersApi;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.CustomerRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.CustomerResponse;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.CustomerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class CustomerController implements CustomersApi {
    private final CustomerService customerService;
    private final CustomerMapper customerMapper;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return CustomersApi.super.getRequest();
    }

    @Override
    public ResponseEntity<CustomerResponse> createCustomer(CustomerRequest customerRequest) {
        var customer = customerMapper.toDomain(customerRequest);
        var created = customerService.createCustomer(customer);
        var response = customerMapper.toResponse(created);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> deleteCustomer(String customerId) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<CustomerResponse> getCustomerById(String customerId) {
        var customer = customerService.getCustomerById(customerId);
        if (customer == null) return ResponseEntity.notFound().build();
        var response = customerMapper.toResponse(customer);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<List<CustomerResponse>> listCustomers() {
        var customers = customerService.getAllCustomers();
        var responses = customers.stream().map(customerMapper::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @Override
    public ResponseEntity<CustomerResponse> updateCustomer(String customerId, CustomerRequest customerRequest) {
        var customer = customerMapper.toDomain(customerRequest);
        var updated = customerService.updateCustomer(customerId, customer);
        var response = customerMapper.toResponse(updated);
        return ResponseEntity.ok(response);
    }
}
