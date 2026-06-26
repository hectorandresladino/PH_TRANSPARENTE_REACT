package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assemblies")
public class Assembly {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String description;

  @Column(nullable = false)
  private String type;

  @Column(name = "scheduled_date")
  private LocalDate scheduledDate;

  @Column(name = "scheduled_time")
  private String scheduledTime;

  private String location;

  @Column(nullable = false)
  private String status;

  private String agenda;

  private String minutes;

  @Column(name = "quorum_required")
  private Integer quorumRequired;

  @Column(name = "quorum_attended")
  private Integer quorumAttended;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  public Assembly() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public LocalDate getScheduledDate() { return scheduledDate; }
  public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

  public String getScheduledTime() { return scheduledTime; }
  public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

  public String getLocation() { return location; }
  public void setLocation(String location) { this.location = location; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getAgenda() { return agenda; }
  public void setAgenda(String agenda) { this.agenda = agenda; }

  public String getMinutes() { return minutes; }
  public void setMinutes(String minutes) { this.minutes = minutes; }

  public Integer getQuorumRequired() { return quorumRequired; }
  public void setQuorumRequired(Integer quorumRequired) { this.quorumRequired = quorumRequired; }

  public Integer getQuorumAttended() { return quorumAttended; }
  public void setQuorumAttended(Integer quorumAttended) { this.quorumAttended = quorumAttended; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
