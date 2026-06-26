package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "annual_budgets")
public class AnnualBudget {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "budget_year", nullable = false)
  private Integer budgetYear;

  @Column(nullable = false)
  private String budgetName;

  private String description;

  @Column(name = "total_budgeted_amount")
  private String totalBudgetedAmount;

  @Column(name = "total_executed_amount")
  private String totalExecutedAmount;

  @Column(name = "total_remaining_amount")
  private String totalRemainingAmount;

  @Column(name = "execution_percentage")
  private Double executionPercentage;

  @Column(name = "approval_date")
  private LocalDate approvalDate;

  @Column(name = "approved_by")
  private String approvedBy;

  @Column(name = "assembly_resolution")
  private String assemblyResolution;

  private String status;

  @Column(name = "budget_type")
  private String budgetType;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  @Column(name = "updated_by")
  private String updatedBy;

  public AnnualBudget() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Integer getBudgetYear() { return budgetYear; }
  public void setBudgetYear(Integer budgetYear) { this.budgetYear = budgetYear; }

  public String getBudgetName() { return budgetName; }
  public void setBudgetName(String budgetName) { this.budgetName = budgetName; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getTotalBudgetedAmount() { return totalBudgetedAmount; }
  public void setTotalBudgetedAmount(String totalBudgetedAmount) { this.totalBudgetedAmount = totalBudgetedAmount; }

  public String getTotalExecutedAmount() { return totalExecutedAmount; }
  public void setTotalExecutedAmount(String totalExecutedAmount) { this.totalExecutedAmount = totalExecutedAmount; }

  public String getTotalRemainingAmount() { return totalRemainingAmount; }
  public void setTotalRemainingAmount(String totalRemainingAmount) { this.totalRemainingAmount = totalRemainingAmount; }

  public Double getExecutionPercentage() { return executionPercentage; }
  public void setExecutionPercentage(Double executionPercentage) { this.executionPercentage = executionPercentage; }

  public LocalDate getApprovalDate() { return approvalDate; }
  public void setApprovalDate(LocalDate approvalDate) { this.approvalDate = approvalDate; }

  public String getApprovedBy() { return approvedBy; }
  public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

  public String getAssemblyResolution() { return assemblyResolution; }
  public void setAssemblyResolution(String assemblyResolution) { this.assemblyResolution = assemblyResolution; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getBudgetType() { return budgetType; }
  public void setBudgetType(String budgetType) { this.budgetType = budgetType; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

  public String getUpdatedBy() { return updatedBy; }
  public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
