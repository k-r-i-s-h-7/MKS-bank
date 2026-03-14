package com.example.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.services.PaymentService;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/deposit")
    public void deposit(@RequestParam Long accountId, @RequestParam double amount) {
        paymentService.deposit(accountId, amount);
    }

    @PostMapping("/withdraw")
    public void withdraw(@RequestParam Long accountId, @RequestParam double amount) {
        paymentService.withdraw(accountId, amount);
    }

    @PostMapping("/transfer")
    public void transfer(@RequestParam Long fromAccountId,
                         @RequestParam Long toAccountId,
                         @RequestParam double amount) {
        paymentService.transfer(fromAccountId, toAccountId, amount);
    }
}