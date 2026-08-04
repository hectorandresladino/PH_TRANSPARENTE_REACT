package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
  List<BankAccount> findByOrganizationId(Long organizationId);
  List<BankAccount> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<BankAccount> findByOrganizationIdAndAccountType(Long organizationId, String accountType);
  List<BankAccount> findByOrganizationIdAndBankName(Long organizationId, String bankName);
  List<BankAccount> findByOrganizationIdAndIsOperational(Long organizationId, Boolean isOperational);
  List<BankAccount> findByOrganizationIdAndIsReserveFund(Long organizationId, Boolean isReserveFund);
  BankAccount findByOrganizationIdAndAccountNumber(Long organizationId, String accountNumber);
}
