package com.example.backend.dto;


public class RegisterDTO {

    private String username;
    private String password;
    private String role; // CUSTOMER or ADMIN
    private Long customerId; // optional for linking to Customer entity

    public RegisterDTO() {}

    public RegisterDTO(String username, String password, String role, Long customerId) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.customerId = customerId;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
}