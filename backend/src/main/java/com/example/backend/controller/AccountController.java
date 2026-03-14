package com.example.backend.controller;

import java.util.List;
import com.example.backend.services.AccountService;
import com.example.backend.dto.AccountDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // Create a new account
    @PostMapping
    public AccountDTO createAccount(@RequestBody AccountDTO dto) {
        return accountService.createAccount(dto);
    }

    // Get account by ID
    @GetMapping("/{id}")
    public AccountDTO getAccount(@PathVariable Long id) {
        return accountService.getAccount(id);
    }

    @GetMapping("/{id}/balance")
    public double getBalance(@PathVariable Long id) {
        return accountService.getBalance(id);
    }

    // Get all accounts of a customer
    @GetMapping("/customer/{customerId}")
    public List<AccountDTO> getAccountsByCustomer(@PathVariable Long customerId) {
        return accountService.getAccountsByCustomer(customerId);
    }
    
}