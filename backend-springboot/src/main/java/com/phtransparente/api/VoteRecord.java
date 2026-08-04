package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vote_records", uniqueConstraints = @UniqueConstraint(columnNames = {"vote_id", "user_id"}))
public class VoteRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "vote_id", nullable = false)
  private Long voteId;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "username", nullable = false)
  private String username;

  @Column(nullable = false)
  private String choice;

  @Column(name = "voted_at")
  private LocalDateTime votedAt;

  @Column(name = "organization_id", nullable = false)
  private Long organizationId;

  public VoteRecord() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getVoteId() { return voteId; }
  public void setVoteId(Long voteId) { this.voteId = voteId; }

  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public String getChoice() { return choice; }
  public void setChoice(String choice) { this.choice = choice; }

  public LocalDateTime getVotedAt() { return votedAt; }
  public void setVotedAt(LocalDateTime votedAt) { this.votedAt = votedAt; }

  public Long getOrganizationId() { return organizationId; }
  public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }
}
