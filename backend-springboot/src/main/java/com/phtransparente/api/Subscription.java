package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
public class Subscription {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long organizationId;

  @Column(nullable = false)
  private Long planId;

  @Column(nullable = false)
  private String status = "TRIAL"; // TRIAL, ACTIVE, PAST_DUE, CANCELLED, EXPIRED

  private LocalDate startDate;
  private LocalDate endDate;
  private LocalDate trialEndsAt;

  @Column(nullable = false)
  private String billingPeriod = "MONTHLY";

  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getOrganizationId() { return organizationId; }
  public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

  public Long getPlanId() { return planId; }
  public void setPlanId(Long planId) { this.planId = planId; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public LocalDate getStartDate() { return startDate; }
  public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

  public LocalDate getEndDate() { return endDate; }
  public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

  public LocalDate getTrialEndsAt() { return trialEndsAt; }
  public void setTrialEndsAt(LocalDate trialEndsAt) { this.trialEndsAt = trialEndsAt; }

  public String getBillingPeriod() { return billingPeriod; }
  public void setBillingPeriod(String billingPeriod) { this.billingPeriod = billingPeriod; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
