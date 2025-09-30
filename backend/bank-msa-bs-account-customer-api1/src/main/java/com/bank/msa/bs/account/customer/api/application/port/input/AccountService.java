package com.bank.msa.bs.account.customer.api.application.port.input;

import com.bank.msa.bs.account.customer.api.domain.Account;
import java.util.List;

public interface AccountService {
    List<Account> getAllAccounts();
    Account createAccount(Account account);
    Account updateAccount(Integer accountId, Account account);
    void deleteAccount(Integer accountId);
}
