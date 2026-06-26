package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "transparency_metrics")
public class TransparencyMetrics {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "metric_name", nullable = false)
  private String metricName;

  @Column(name = "metric_category", nullable = false)
  private String metricCategory;

  @Column(name = "metric_value")
  private String metricValue;

  @Column(name = "metric_percentage")
  private Double metricPercentage;

  @Column(name = "target_value")
  private String targetValue;

  @Column(name = "target_percentage")
  private Double targetPercentage;

  @Column(name = "status")
  private String status;

  @Column(name = "period")
  private String period;

  @Column(name = "metric_date")
  private LocalDate metricDate;

  @Column(name = "related_article")
  private String relatedArticle;

  private String description;

  @Column(name = "is_compliant")
  private Boolean isCompliant;

  @Column(name = "compliance_notes")
  private String complianceNotes;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  public TransparencyMetrics() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getMetricName() { return metricName; }
  public void setMetricName(String metricName) { this.metricName = metricName; }

  public String getMetricCategory() { return metricCategory; }
  public void setMetricCategory(String metricCategory) { this.metricCategory = metricCategory; }

  public String getMetricValue() { return metricValue; }
  public void setMetricValue(String metricValue) { this.metricValue = metricValue; }

  public Double getMetricPercentage() { return metricPercentage; }
  public void setMetricPercentage(Double metricPercentage) { this.metricPercentage = metricPercentage; }

  public String getTargetValue() { return targetValue; }
  public void setTargetValue(String targetValue) { this.targetValue = targetValue; }

  public Double getTargetPercentage() { return targetPercentage; }
  public void setTargetPercentage(Double targetPercentage) { this.targetPercentage = targetPercentage; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getPeriod() { return period; }
  public void setPeriod(String period) { this.period = period; }

  public LocalDate getMetricDate() { return metricDate; }
  public void setMetricDate(LocalDate metricDate) { this.metricDate = metricDate; }

  public String getRelatedArticle() { return relatedArticle; }
  public void setRelatedArticle(String relatedArticle) { this.relatedArticle = relatedArticle; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public Boolean getIsCompliant() { return isCompliant; }
  public void setIsCompliant(Boolean isCompliant) { this.isCompliant = isCompliant; }

  public String getComplianceNotes() { return complianceNotes; }
  public void setComplianceNotes(String complianceNotes) { this.complianceNotes = complianceNotes; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }
}
