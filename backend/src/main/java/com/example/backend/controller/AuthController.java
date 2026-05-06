package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.Account;
import com.example.backend.model.Customer;
import com.example.backend.model.User;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.services.UserService;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;

    public AuthController(
            UserService userService,
            CustomerRepository customerRepository,
            AccountRepository accountRepository
    ) {
        this.userService = userService;
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {

        Customer customer = new Customer();
        customer.setName(request.getUsername());
        customer.setEmail(request.getUsername() + "@mks.local");
        customer.setPhone("N/A");
        customer.setKycStatus("PENDING");
        customer.setCreatedAt(LocalDateTime.now());
        Customer savedCustomer = customerRepository.save(customer);

        Account account = new Account();
        account.setCustomer(savedCustomer);
        account.setType("SAVINGS");
        account.setBalance(0.0);
        account.setStatus("ACTIVE");
        account.setCreatedAt(LocalDateTime.now());
        accountRepository.save(account);

        return userService.register(
                request.getUsername(),
                request.getPassword(),
                request.getRole(),
                savedCustomer
        );
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        return userService.login(
                request.getUsername(),
                request.getPassword()
        );
    }
}
