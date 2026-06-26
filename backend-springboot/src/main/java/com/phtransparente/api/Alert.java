package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "alerts")
public class Alert {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String alertType;

  @Column(nullable = false)
  private String severity;

  @Column(nullable = false)
  private String title;

  private String description;

  @Column(name = "related_module")
  private String relatedModule;

  @Column(name = "reference_id")
  private Long referenceId;

  @Column(name = "alert_date")
  private LocalDate alertDate;

  @Column(name = "expiry_date")
  private LocalDate expiryDate;

  private String status;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "assigned_to")
  private String assignedTo;

  @Column(name = "is_public")
  private Boolean isPublic;

  @Column(name = "target_audience")
  private String targetAudience;

  private String observations;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  @Column(name = "resolved_at")
  private LocalDate resolvedAt;

  @Column(name = "resolved_by")
  private String resolvedBy;

  @Column(name = "resolution_notes")
  private String resolutionNotes;

  public Alert() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getAlertType() { return alertType; }
  public void setAlertType(String alertType) { this.alertType = alertType; }

  public String getSeverity() { return severity; }
  public void setSeverity(String severity) { this.severity = severity; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getRelatedModule() { return relatedModule; }
  public void setRelatedModule(String relatedModule) { this.relatedModule = relatedModule; }

  public Long getReferenceId() { return referenceId; }
  public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }

  public LocalDate getAlertDate() { return alertDate; }
  public void setAlertDate(LocalDate alertDate) { this.alertDate = alertDate; }

  public LocalDate getExpiryDate() { return expiryDate; }
  public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

  public String getAssignedTo() { return assignedTo; }
  public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

  public Boolean getIsPublic() { return isPublic; }
  public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

  public String getTargetAudience() { return targetAudience; }
  public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

  public String getObservations() { return observations; }
  public void setObservations(String observations) { this.observations = observations; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

  public LocalDate getResolvedAt() { return resolvedAt; }
  public void setResolvedAt(LocalDate resolvedAt) { this.resolvedAt = resolvedAt; }

  public String getResolvedBy() { return resolvedBy; }
  public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }

  public String getResolutionNotes() { return resolutionNotes; }
  public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
