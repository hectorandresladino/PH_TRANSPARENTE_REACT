package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
  List<BankAccount> findByStatus(String status);
  List<BankAccount> findByAccountType(String accountType);
  List<BankAccount> findByBankName(String bankName);
  List<BankAccount> findByIsOperational(Boolean isOperational);
  List<BankAccount> findByIsReserveFund(Boolean isReserveFund);
  BankAccount findByAccountNumber(String accountNumber);
}
