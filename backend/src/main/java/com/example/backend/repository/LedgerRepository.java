package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.LedgerEntry;

@Repository
public interface LedgerRepository extends JpaRepository<LedgerEntry, Long> {

}