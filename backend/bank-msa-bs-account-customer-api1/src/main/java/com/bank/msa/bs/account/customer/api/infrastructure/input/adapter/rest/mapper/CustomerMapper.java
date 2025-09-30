package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper;

import com.bank.msa.bs.account.customer.api.domain.Customer;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.CustomerRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.CustomerResponse;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.CustomerTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

    Customer toDomain(CustomerRequest request);

    CustomerResponse toResponse(Customer domain);
    
    @Mapping(target = "person.name", source = "name")
    @Mapping(target = "person.address", source = "address")
    @Mapping(target = "person.phone", source = "phone")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "status", source = "status")
    CustomerTable toEntity(Customer domain);

    @Mapping(target = "name", source = "person.name")
    @Mapping(target = "address", source = "person.address")
    @Mapping(target = "phone", source = "person.phone")
    Customer toDomain(CustomerTable entity);
}
