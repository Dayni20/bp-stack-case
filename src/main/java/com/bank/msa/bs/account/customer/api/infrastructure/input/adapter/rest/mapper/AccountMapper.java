package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper;

import com.bank.msa.bs.account.customer.api.domain.Account;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.AccountResponse;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.AccountTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);

    Account toDomain(AccountRequest request);

    // Domain → Response
    AccountResponse toResponse(Account domain);

    // Domain → Entity
    AccountTable toEntity(Account domain);

    // Entity → Domain
    Account toDomain(AccountTable entity);
}
