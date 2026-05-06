package com.example.backend.services;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.backend.repository.*;
import com.example.backend.dto.AccountDTO;
import com.example.backend.model.Account;
import com.example.backend.model.Customer;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    public AccountService(AccountRepository accountRepository,
            CustomerRepository customerRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    // Create a new account
    public AccountDTO createAccount(AccountDTO dto) {
        // Validate customer exists
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Map DTO to entity
        Account account = new Account();
        account.setCustomer(customer);
        account.setType(dto.getType());
        account.setBalance(dto.getBalance());
        account.setStatus("ACTIVE");
        account.setCreatedAt(LocalDateTime.now());

        // Save to database
        Account saved = accountRepository.save(account);

        // Map entity to DTO
        return convertToDTO(saved);
    }

    // Get account by ID
    public AccountDTO getAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return convertToDTO(account);
    }

    public double getBalance(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return account.getBalance();
    }

    // Get all accounts of a customer
    public List<AccountDTO> getAccountsByCustomer(Long customerId) {
        List<Account> accounts = accountRepository.findByCustomerId(customerId);
        return accounts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Convert entity to DTO
    public AccountDTO convertToDTO(Account account) {
        Long customerId = account.getCustomer() != null ? account.getCustomer().getId() : null;
        return new AccountDTO(
                account.getId(),
            customerId,
                account.getType(),
                account.getBalance(),
                account.getStatus());
    }
}