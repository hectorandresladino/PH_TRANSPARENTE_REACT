package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reserve_funds")
public class ReserveFund {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String fundName;

  private String description;

  @Column(name = "total_amount")
  private String totalAmount;

  @Column(name = "current_balance")
  private String currentBalance;

  @Column(name = "required_percentage")
  private Double requiredPercentage;

  @Column(name = "required_amount")
  private String requiredAmount;

  @Column(name = "accumulated_amount")
  private String accumulatedAmount;

  @Column(name = "last_contribution_date")
  private LocalDate lastContributionDate;

  @Column(name = "next_contribution_date")
  private LocalDate nextContributionDate;

  @Column(name = "contribution_frequency")
  private String contributionFrequency;

  private String status;

  @Column(name = "fund_type")
  private String fundType;

  @Column(name = "approval_date")
  private LocalDate approvalDate;

  @Column(name = "approved_by")
  private String approvedBy;

  @Column(name = "assembly_resolution")
  private String assemblyResolution;

  @Column(name = "bank_account")
  private String bankAccount;

  @Column(name = "investment_type")
  private String investmentType;

  @Column(name = "investment_return")
  private String investmentReturn;

  @Column(name = "last_audit_date")
  private LocalDate lastAuditDate;

  @Column(name = "next_audit_date")
  private LocalDate nextAuditDate;

  private String observations;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  @Column(name = "updated_by")
  private String updatedBy;

  public ReserveFund() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getFundName() { return fundName; }
  public void setFundName(String fundName) { this.fundName = fundName; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getTotalAmount() { return totalAmount; }
  public void setTotalAmount(String totalAmount) { this.totalAmount = totalAmount; }

  public String getCurrentBalance() { return currentBalance; }
  public void setCurrentBalance(String currentBalance) { this.currentBalance = currentBalance; }

  public Double getRequiredPercentage() { return requiredPercentage; }
  public void setRequiredPercentage(Double requiredPercentage) { this.requiredPercentage = requiredPercentage; }

  public String getRequiredAmount() { return requiredAmount; }
  public void setRequiredAmount(String requiredAmount) { this.requiredAmount = requiredAmount; }

  public String getAccumulatedAmount() { return accumulatedAmount; }
  public void setAccumulatedAmount(String accumulatedAmount) { this.accumulatedAmount = accumulatedAmount; }

  public LocalDate getLastContributionDate() { return lastContributionDate; }
  public void setLastContributionDate(LocalDate lastContributionDate) { this.lastContributionDate = lastContributionDate; }

  public LocalDate getNextContributionDate() { return nextContributionDate; }
  public void setNextContributionDate(LocalDate nextContributionDate) { this.nextContributionDate = nextContributionDate; }

  public String getContributionFrequency() { return contributionFrequency; }
  public void setContributionFrequency(String contributionFrequency) { this.contributionFrequency = contributionFrequency; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getFundType() { return fundType; }
  public void setFundType(String fundType) { this.fundType = fundType; }

  public LocalDate getApprovalDate() { return approvalDate; }
  public void setApprovalDate(LocalDate approvalDate) { this.approvalDate = approvalDate; }

  public String getApprovedBy() { return approvedBy; }
  public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

  public String getAssemblyResolution() { return assemblyResolution; }
  public void setAssemblyResolution(String assemblyResolution) { this.assemblyResolution = assemblyResolution; }

  public String getBankAccount() { return bankAccount; }
  public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }

  public String getInvestmentType() { return investmentType; }
  public void setInvestmentType(String investmentType) { this.investmentType = investmentType; }

  public String getInvestmentReturn() { return investmentReturn; }
  public void setInvestmentReturn(String investmentReturn) { this.investmentReturn = investmentReturn; }

  public LocalDate getLastAuditDate() { return lastAuditDate; }
  public void setLastAuditDate(LocalDate lastAuditDate) { this.lastAuditDate = lastAuditDate; }

  public LocalDate getNextAuditDate() { return nextAuditDate; }
  public void setNextAuditDate(LocalDate nextAuditDate) { this.nextAuditDate = nextAuditDate; }

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
