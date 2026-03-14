package com.example.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.model.Account;
import com.example.backend.model.LedgerEntry;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.LedgerRepository;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final AccountRepository accountRepository;
    private final LedgerRepository ledgerRepository;

    public PaymentService(AccountRepository accountRepository,
                          LedgerRepository ledgerRepository) {
        this.accountRepository = accountRepository;
        this.ledgerRepository = ledgerRepository;
    }

    // Deposit money into an account
    @Transactional
    public void deposit(Long accountId, double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        LedgerEntry entry = new LedgerEntry();
        entry.setAccountId(accountId);
        entry.setType("DEPOSIT");
        entry.setAmount(amount);
        entry.setCreatedAt(LocalDateTime.now());
        ledgerRepository.save(entry);
    }

    // Withdraw money from an account
    @Transactional
    public void withdraw(Long accountId, double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        LedgerEntry entry = new LedgerEntry();
        entry.setAccountId(accountId);
        entry.setType("WITHDRAWAL");
        entry.setAmount(amount);
        entry.setCreatedAt(LocalDateTime.now());
        ledgerRepository.save(entry);
    }

    // Transfer money between accounts
    @Transactional
    public void transfer(Long fromAccountId, Long toAccountId, double amount) {
        withdraw(fromAccountId, amount);
        deposit(toAccountId, amount);

        LedgerEntry entry = new LedgerEntry();
        entry.setAccountId(fromAccountId);
        entry.setType("TRANSFER");
        entry.setAmount(amount);
        entry.setCreatedAt(LocalDateTime.now());
        entry.setReference("TO:" + toAccountId);
        ledgerRepository.save(entry);
    }
}
