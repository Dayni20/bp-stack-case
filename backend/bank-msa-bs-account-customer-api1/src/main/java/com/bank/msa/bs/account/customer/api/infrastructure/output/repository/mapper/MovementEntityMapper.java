package com.bank.msa.bs.account.customer.api.infrastructure.output.repository.mapper;

import com.bank.msa.bs.account.customer.api.domain.Movement;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.AccountTable;
import com.bank.msa.bs.account.customer.api.infrastructure.output.repository.entity.MovementTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MovementEntityMapper {

    MovementEntityMapper INSTANCE = Mappers.getMapper(MovementEntityMapper.class);

    @Mapping(target = "account", source = "accountId", qualifiedByName = "accountRef")
    MovementTable toEntity(Movement domain);

    @Mapping(target = "accountId", expression = "java(entity.getAccount() != null ? entity.getAccount().getAccountId() : null)")
    @Mapping(target = "accountNumber", expression = "java(entity.getAccount() != null ? entity.getAccount().getAccountNumber() : null)")
    Movement toDomain(MovementTable entity);

    @Named("accountRef")
    default AccountTable accountRef(Integer accountId) {
        if (accountId == null) return null;
        AccountTable account = new AccountTable();
        account.setAccountId(accountId);
        return account;
    }
}