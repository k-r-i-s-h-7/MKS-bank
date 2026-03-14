package com.example.backend.dto;

public class AccountDTO {
    private Long id;
    private Long customerId;
    private String type;
    private double balance;
    private String status;

    public AccountDTO() {}

    public AccountDTO(Long id, Long customerId, String type, double balance, String status) {
        this.id = id;
        this.customerId = customerId;
        this.type = type;
        this.balance = balance;
        this.status = status;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}