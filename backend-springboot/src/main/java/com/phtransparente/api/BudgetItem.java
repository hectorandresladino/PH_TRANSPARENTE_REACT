package com.phtransparente.api;

import jakarta.persistence.*;

@Entity
@Table(name = "budget_items")
public class BudgetItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "budget_id", nullable = false)
  private Long budgetId;

  @Column(nullable = false)
  private String category;

  @Column(name = "sub_category")
  private String subCategory;

  @Column(name = "budgeted_amount")
  private String budgetedAmount;

  @Column(name = "executed_amount")
  private String executedAmount;

  @Column(name = "remaining_amount")
  private String remainingAmount;

  private String description;

  public BudgetItem() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getBudgetId() { return budgetId; }
  public void setBudgetId(Long budgetId) { this.budgetId = budgetId; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public String getSubCategory() { return subCategory; }
  public void setSubCategory(String subCategory) { this.subCategory = subCategory; }

  public String getBudgetedAmount() { return budgetedAmount; }
  public void setBudgetedAmount(String budgetedAmount) { this.budgetedAmount = budgetedAmount; }

  public String getExecutedAmount() { return executedAmount; }
  public void setExecutedAmount(String executedAmount) { this.executedAmount = executedAmount; }

  public String getRemainingAmount() { return remainingAmount; }
  public void setRemainingAmount(String remainingAmount) { this.remainingAmount = remainingAmount; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
}
