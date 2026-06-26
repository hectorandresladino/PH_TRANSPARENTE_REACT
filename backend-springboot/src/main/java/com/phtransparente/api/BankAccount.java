package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bank_accounts")
public class BankAccount {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String accountNumber;

  @Column(nullable = false)
  private String bankName;

  @Column(name = "account_type", nullable = false)
  private String accountType;

  @Column(name = "account_name")
  private String accountName;

  @Column(name = "current_balance")
  private String currentBalance;

  @Column(name = "account_purpose")
  private String accountPurpose;

  @Column(name = "is_operational")
  private Boolean isOperational;

  @Column(name = "is_reserve_fund")
  private Boolean isReserveFund;

  @Column(name = "opening_date")
  private LocalDate openingDate;

  @Column(name = "closing_date")
  private LocalDate closingDate;

  private String status;

  @Column(name = "authorized_signatories")
  private String authorizedSignatories;

  @Column(name = "account_manager")
  private String accountManager;

  @Column(name = "manager_phone")
  private String managerPhone;

  @Column(name = "manager_email")
  private String managerEmail;

  @Column(name = "branch_office")
  private String branchOffice;

  @Column(name = "swift_code")
  private String swiftCode;

  @Column(name = "account_currency")
  private String accountCurrency;

  @Column(name = "minimum_balance")
  private String minimumBalance;

  @Column(name = "overdraft_limit")
  private String overdraftLimit;

  @Column(name = "interest_rate")
  private String interestRate;

  @Column(name = "monthly_fee")
  private String monthlyFee;

  @Column(name = "last_statement_date")
  private LocalDate lastStatementDate;

  @Column(name = "next_statement_date")
  private LocalDate nextStatementDate;

  private String observations;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  @Column(name = "updated_by")
  private String updatedBy;

  public BankAccount() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getAccountNumber() { return accountNumber; }
  public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

  public String getBankName() { return bankName; }
  public void setBankName(String bankName) { this.bankName = bankName; }

  public String getAccountType() { return accountType; }
  public void setAccountType(String accountType) { this.accountType = accountType; }

  public String getAccountName() { return accountName; }
  public void setAccountName(String accountName) { this.accountName = accountName; }

  public String getCurrentBalance() { return currentBalance; }
  public void setCurrentBalance(String currentBalance) { this.currentBalance = currentBalance; }

  public String getAccountPurpose() { return accountPurpose; }
  public void setAccountPurpose(String accountPurpose) { this.accountPurpose = accountPurpose; }

  public Boolean getIsOperational() { return isOperational; }
  public void setIsOperational(Boolean isOperational) { this.isOperational = isOperational; }

  public Boolean getIsReserveFund() { return isReserveFund; }
  public void setIsReserveFund(Boolean isReserveFund) { this.isReserveFund = isReserveFund; }

  public LocalDate getOpeningDate() { return openingDate; }
  public void setOpeningDate(LocalDate openingDate) { this.openingDate = openingDate; }

  public LocalDate getClosingDate() { return closingDate; }
  public void setClosingDate(LocalDate closingDate) { this.closingDate = closingDate; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getAuthorizedSignatories() { return authorizedSignatories; }
  public void setAuthorizedSignatories(String authorizedSignatories) { this.authorizedSignatories = authorizedSignatories; }

  public String getAccountManager() { return accountManager; }
  public void setAccountManager(String accountManager) { this.accountManager = accountManager; }

  public String getManagerPhone() { return managerPhone; }
  public void setManagerPhone(String managerPhone) { this.managerPhone = managerPhone; }

  public String getManagerEmail() { return managerEmail; }
  public void setManagerEmail(String managerEmail) { this.managerEmail = managerEmail; }

  public String getBranchOffice() { return branchOffice; }
  public void setBranchOffice(String branchOffice) { this.branchOffice = branchOffice; }

  public String getSwiftCode() { return swiftCode; }
  public void setSwiftCode(String swiftCode) { this.swiftCode = swiftCode; }

  public String getAccountCurrency() { return accountCurrency; }
  public void setAccountCurrency(String accountCurrency) { this.accountCurrency = accountCurrency; }

  public String getMinimumBalance() { return minimumBalance; }
  public void setMinimumBalance(String minimumBalance) { this.minimumBalance = minimumBalance; }

  public String getOverdraftLimit() { return overdraftLimit; }
  public void setOverdraftLimit(String overdraftLimit) { this.overdraftLimit = overdraftLimit; }

  public String getInterestRate() { return interestRate; }
  public void setInterestRate(String interestRate) { this.interestRate = interestRate; }

  public String getMonthlyFee() { return monthlyFee; }
  public void setMonthlyFee(String monthlyFee) { this.monthlyFee = monthlyFee; }

  public LocalDate getLastStatementDate() { return lastStatementDate; }
  public void setLastStatementDate(LocalDate lastStatementDate) { this.lastStatementDate = lastStatementDate; }

  public LocalDate getNextStatementDate() { return nextStatementDate; }
  public void setNextStatementDate(LocalDate nextStatementDate) { this.nextStatementDate = nextStatementDate; }

  public String getObservations() { return observations; }
  public void setObservations(String observations) { this.observations = observations; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

  public String getUpdatedBy() { return updatedBy; }
  public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
