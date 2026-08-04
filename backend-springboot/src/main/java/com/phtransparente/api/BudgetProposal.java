package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "budget_proposals")
public class BudgetProposal {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "budget_id", nullable = false)
  private Long budgetId;

  @Column(nullable = false)
  private String title;

  private String description;

  @Column(name = "estimated_cost")
  private String estimatedCost;

  @Column(name = "proposed_by")
  private String proposedBy;

  @Column(name = "proposed_at")
  private LocalDateTime proposedAt;

  private String status;

  @Column(name = "votes_for")
  private Integer votesFor;

  @Column(name = "votes_against")
  private Integer votesAgainst;

  @Column(name = "votes_abstain")
  private Integer votesAbstain;

  @Column(name = "organization_id", nullable = false)
  private Long organizationId;

  public BudgetProposal() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getBudgetId() { return budgetId; }
  public void setBudgetId(Long budgetId) { this.budgetId = budgetId; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getEstimatedCost() { return estimatedCost; }
  public void setEstimatedCost(String estimatedCost) { this.estimatedCost = estimatedCost; }

  public String getProposedBy() { return proposedBy; }
  public void setProposedBy(String proposedBy) { this.proposedBy = proposedBy; }

  public LocalDateTime getProposedAt() { return proposedAt; }
  public void setProposedAt(LocalDateTime proposedAt) { this.proposedAt = proposedAt; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public Integer getVotesFor() { return votesFor; }
  public void setVotesFor(Integer votesFor) { this.votesFor = votesFor; }

  public Integer getVotesAgainst() { return votesAgainst; }
  public void setVotesAgainst(Integer votesAgainst) { this.votesAgainst = votesAgainst; }

  public Integer getVotesAbstain() { return votesAbstain; }
  public void setVotesAbstain(Integer votesAbstain) { this.votesAbstain = votesAbstain; }

  public Long getOrganizationId() { return organizationId; }
  public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
