package com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.mapper;

import com.bank.msa.bs.account.customer.api.domain.Movement;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.TransactionRequest;
import com.bank.msa.bs.account.customer.api.infrastructure.input.adapter.rest.models.TransactionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MovementMapper {

    MovementMapper INSTANCE = Mappers.getMapper(MovementMapper.class);

    @Mapping(target = "movementId", ignore = true)
    @Mapping(target = "accountId", ignore = true) 
    @Mapping(target = "availableBalance", ignore = true)
    @Mapping(target = "accountNumber", source = "accountNumber")
    @Mapping(target = "movementType", source = "transactionType")
    @Mapping(target = "value", source = "amount")
    Movement toDomainFromCreate(TransactionRequest request);

    @Mapping(target = "movementId", ignore = true)
    @Mapping(target = "accountId", ignore = true)
    @Mapping(target = "availableBalance", ignore = true)
    @Mapping(target = "accountNumber", ignore = true)
    @Mapping(target = "movementType", source = "transactionType")
    @Mapping(target = "value", source = "amount")
    Movement toDomainFromUpdate(TransactionRequest request);

    @Mapping(target = "movementId", source = "movementId")
    @Mapping(target = "accountNumber", source = "accountNumber")
    @Mapping(target = "transactionType", source = "movementType")
    @Mapping(target = "amount", source = "value")
    TransactionResponse toResponse(Movement domain);
}