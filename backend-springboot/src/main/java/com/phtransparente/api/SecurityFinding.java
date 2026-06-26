package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_findings")
public class SecurityFinding {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String description;

  private String type;

  private String severity;

  private String location;

  private String zone;

  private String status;

  private String reportedBy;

  private String assignedTo;

  @Column(name = "reported_date")
  private LocalDateTime reportedDate;

  @Column(name = "resolved_date")
  private LocalDateTime resolvedDate;

  private String resolution;

  private String actionTaken;

  private String evidence;

  private String priority;

  private String category;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "created_by")
  private String createdBy;

  public SecurityFinding() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public String getSeverity() { return severity; }
  public void setSeverity(String severity) { this.severity = severity; }

  public String getLocation() { return location; }
  public void setLocation(String location) { this.location = location; }

  public String getZone() { return zone; }
  public void setZone(String zone) { this.zone = zone; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getReportedBy() { return reportedBy; }
  public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }

  public String getAssignedTo() { return assignedTo; }
  public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

  public LocalDateTime getReportedDate() { return reportedDate; }
  public void setReportedDate(LocalDateTime reportedDate) { this.reportedDate = reportedDate; }

  public LocalDateTime getResolvedDate() { return resolvedDate; }
  public void setResolvedDate(LocalDateTime resolvedDate) { this.resolvedDate = resolvedDate; }

  public String getResolution() { return resolution; }
  public void setResolution(String resolution) { this.resolution = resolution; }

  public String getActionTaken() { return actionTaken; }
  public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }

  public String getEvidence() { return evidence; }
  public void setEvidence(String evidence) { this.evidence = evidence; }

  public String getPriority() { return priority; }
  public void setPriority(String priority) { this.priority = priority; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
