package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.Customer;
import com.example.backend.model.User;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.services.UserService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:30000"})
public class AuthController {

    private final UserService userService;
    private final CustomerRepository customerRepository;

    public AuthController(UserService userService, CustomerRepository customerRepository) {
        this.userService = userService;
        this.customerRepository = customerRepository;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {

        Customer customer = null;

        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
        }

        return userService.register(
                request.getUsername(),
                request.getPassword(),
                request.getRole(),
                customer
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