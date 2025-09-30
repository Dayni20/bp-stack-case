package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper;

import com.bank.msa.bs.account.customer.api.domain.Account;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountCreateRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountUpdateRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountResponse;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.AccountTable;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.CustomerTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);

    @Mapping(target = "accountId", ignore = true)
    @Mapping(target = "customerName", ignore = true)
    Account toDomainFromCreate(AccountCreateRequest request);

    @Mapping(target = "accountId", ignore = true)
    @Mapping(target = "customerId", ignore = true)
    @Mapping(target = "customerName", ignore = true)
    Account toDomainFromUpdate(AccountUpdateRequest request);



    AccountResponse toResponse(Account domain);

    @Mapping(target = "customer", source = "customerId", qualifiedByName = "customerRef")
    @Mapping(target = "initialBalance", source = "initialBalance", qualifiedByName = "doubleToDecimal")
    AccountTable toEntity(Account domain);

    @Mapping(target = "customerId", expression = "java(entity.getCustomer() != null ? String.valueOf(entity.getCustomer().getCustomerId()) : null)")
    @Mapping(target = "customerName", expression = "java(entity.getCustomer() != null && entity.getCustomer().getPerson() != null ? entity.getCustomer().getPerson().getName() : null)")
    @Mapping(target = "initialBalance", source = "initialBalance", qualifiedByName = "decimalToDouble")
    Account toDomain(AccountTable entity);

    @Named("customerRef")
    default CustomerTable customerRef(String customerId) {
        if (customerId == null) return null;
        CustomerTable customer = new CustomerTable();
        customer.setCustomerId(Integer.parseInt(customerId));
        return customer;
    }

    @Named("doubleToDecimal")
    default BigDecimal doubleToDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    @Named("decimalToDouble")
    default Double decimalToDouble(BigDecimal value) {
        return value != null ? value.doubleValue() : null;
    }
}
