package com.example.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.Account;
import com.example.backend.model.Customer;
import com.example.backend.model.User;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.services.UserService;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public Map<String, Object> register(@RequestBody RegisterRequest request) {

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
        Account savedAccount = accountRepository.save(account);

        User savedUser = userService.register(
                request.getUsername(),
                request.getPassword(),
                request.getRole(),
                savedCustomer
        );

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("username", savedUser.getUsername());
        response.put("customerId", savedCustomer.getId());
        response.put("accountId", savedAccount.getId());
        response.put("accountType", savedAccount.getType());
        return response;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        return userService.login(
                request.getUsername(),
                request.getPassword()
        );
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal() == null
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        User user;
        try {
            user = userService.getUserByUsername(authentication.getName());
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found", ex);
        }
        Customer customer = user.getCustomer();

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole());

        if (customer != null) {
            response.put("customerId", customer.getId());

            List<Account> accounts = accountRepository.findByCustomerId(customer.getId());
            if (!accounts.isEmpty()) {
                Account account = accounts.get(0);
                response.put("accountId", account.getId());
                response.put("accountType", account.getType());
            }
        }

        return response;
    }
}
