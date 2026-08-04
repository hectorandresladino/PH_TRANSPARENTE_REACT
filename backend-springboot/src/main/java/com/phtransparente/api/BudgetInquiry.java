package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "budget_inquiries")
public class BudgetInquiry {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "budget_id", nullable = false)
  private Long budgetId;

  @Column(nullable = false)
  private String question;

  @Column(name = "asked_by")
  private String askedBy;

  @Column(name = "asked_by_role")
  private String askedByRole;

  @Column(name = "asked_at")
  private LocalDateTime askedAt;

  @Column(name = "answer")
  private String answer;

  @Column(name = "answered_by")
  private String answeredBy;

  @Column(name = "answered_at")
  private LocalDateTime answeredAt;

  private String status;

  @Column(name = "organization_id", nullable = false)
  private Long organizationId;

  public BudgetInquiry() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getBudgetId() { return budgetId; }
  public void setBudgetId(Long budgetId) { this.budgetId = budgetId; }

  public String getQuestion() { return question; }
  public void setQuestion(String question) { this.question = question; }

  public String getAskedBy() { return askedBy; }
  public void setAskedBy(String askedBy) { this.askedBy = askedBy; }

  public String getAskedByRole() { return askedByRole; }
  public void setAskedByRole(String askedByRole) { this.askedByRole = askedByRole; }

  public LocalDateTime getAskedAt() { return askedAt; }
  public void setAskedAt(LocalDateTime askedAt) { this.askedAt = askedAt; }

  public String getAnswer() { return answer; }
  public void setAnswer(String answer) { this.answer = answer; }

  public String getAnsweredBy() { return answeredBy; }
  public void setAnsweredBy(String answeredBy) { this.answeredBy = answeredBy; }

  public LocalDateTime getAnsweredAt() { return answeredAt; }
  public void setAnsweredAt(LocalDateTime answeredAt) { this.answeredAt = answeredAt; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public Long getOrganizationId() { return organizationId; }
  public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
