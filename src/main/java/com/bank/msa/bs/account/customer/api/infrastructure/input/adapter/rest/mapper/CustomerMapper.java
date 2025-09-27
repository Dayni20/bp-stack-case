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

    @Mapping(target = "customerId", ignore = true)
    Customer toDomain(CustomerRequest request);

    CustomerResponse toResponse(Customer domain);

    CustomerTable toEntity(Customer domain);

    @Mapping(target = "name", source = "person.name")
    @Mapping(target = "gender", source = "person.gender")
    @Mapping(target = "age", source = "person.age")
    @Mapping(target = "address", source = "person.address")
    @Mapping(target = "phone", source = "person.phone")
    @Mapping(target = "identification", source = "person.identification")
    Customer toDomain(CustomerTable entity);

}
