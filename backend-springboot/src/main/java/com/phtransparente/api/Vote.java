package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "votes")
public class Vote {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String description;

  @Column(nullable = false)
  private String type;

  @Column(name = "assembly_id")
  private Long assemblyId;

  @Column(name = "start_date")
  private LocalDateTime startDate;

  @Column(name = "end_date")
  private LocalDateTime endDate;

  @Column(nullable = false)
  private String status;

  @Column(name = "votes_for")
  private Integer votesFor;

  @Column(name = "votes_against")
  private Integer votesAgainst;

  @Column(name = "votes_abstain")
  private Integer votesAbstain;

  @Column(name = "quorum_required")
  private Integer quorumRequired;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  public Vote() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public Long getAssemblyId() { return assemblyId; }
  public void setAssemblyId(Long assemblyId) { this.assemblyId = assemblyId; }

  public LocalDateTime getStartDate() { return startDate; }
  public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

  public LocalDateTime getEndDate() { return endDate; }
  public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public Integer getVotesFor() { return votesFor; }
  public void setVotesFor(Integer votesFor) { this.votesFor = votesFor; }

  public Integer getVotesAgainst() { return votesAgainst; }
  public void setVotesAgainst(Integer votesAgainst) { this.votesAgainst = votesAgainst; }

  public Integer getVotesAbstain() { return votesAbstain; }
  public void setVotesAbstain(Integer votesAbstain) { this.votesAbstain = votesAbstain; }

  public Integer getQuorumRequired() { return quorumRequired; }
  public void setQuorumRequired(Integer quorumRequired) { this.quorumRequired = quorumRequired; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
