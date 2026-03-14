package com.example.backend.model;

import jakarta.persistence.*;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password; // store hashed!
    private String role; // CUSTOMER, ADMIN

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = true)
    private Customer customer; // optional link for customers

    // Getters & Setters omitted for brevity
}