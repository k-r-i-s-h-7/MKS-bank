package com.example.backend.services;

import java.time.LocalDateTime;
import java.util.List;

// import org.hibernate.mapping.List;
import org.springframework.stereotype.Service;

import com.example.backend.model.Customer;
import com.example.backend.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public Customer createCustomer(Customer customer) {
        customer.setCreatedAt(LocalDateTime.now());
        return repository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public Customer getCustomer(Long id) {
        return repository.findById(id).orElseThrow();
    }
}