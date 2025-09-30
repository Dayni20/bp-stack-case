package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.impl;

import com.bank.msa.bs.account.customer.api.application.port.input.CustomerService;
import com.bank.msa.bs.account.customer.api.domain.Customer;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper.CustomerMapper;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.CustomerRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.CustomerResponse;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class CustomerControllerTest {
    @Mock
    private CustomerMapper customerMapper;
    @Mock
    private CustomerService customerService;
    @InjectMocks
    private CustomerController customerController;

    @Test
    void testCreateCustomer() {
        CustomerRequest request = new CustomerRequest();
        var domain = new Customer();
        var response = new CustomerResponse();
        when(customerMapper.toDomain(request)).thenReturn(domain);
        when(customerService.createCustomer(domain)).thenReturn(domain);
        when(customerMapper.toResponse(domain)).thenReturn(response);
        ResponseEntity<CustomerResponse> result = customerController.createCustomer(request);
        assertEquals(200, result.getStatusCodeValue());
        assertEquals(response, result.getBody());
    }

    @Test
    void testGetAllCustomers() {
        when(customerService.getAllCustomers()).thenReturn(Collections.emptyList());
        ResponseEntity<List<CustomerResponse>> result = customerController.listCustomers();
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
    }
}
