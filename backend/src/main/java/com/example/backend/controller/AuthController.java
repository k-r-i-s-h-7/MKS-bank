package com.example.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Customer;
import com.example.backend.model.User;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.services.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final CustomerRepository customerRepository;

    public AuthController(UserService userService, CustomerRepository customerRepository) {
        this.userService = userService;
        this.customerRepository = customerRepository;
    }

    // Register new user
    @PostMapping("/register")
    public User register(@RequestParam String username,
                         @RequestParam String password,
                         @RequestParam String role,
                         @RequestParam(required = false) Long customerId) {

        Customer customer = null;

        if (customerId != null) {
            customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
        }

        return userService.register(username, password, role, customer);
    }

    // Login endpoint
    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {

        return userService.login(username, password);
    }
}