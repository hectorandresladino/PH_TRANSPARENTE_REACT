package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "personnel_ratings")
public class PersonnelRating {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "rated_person_id", nullable = false)
  private Long ratedPersonId;

  @Column(name = "rated_person_name", nullable = false)
  private String ratedPersonName;

  @Column(name = "rated_person_role", nullable = false)
  private String ratedPersonRole;

  @Column(name = "rated_person_type", nullable = false)
  private String ratedPersonType;

  @Column(name = "rater_id", nullable = false)
  private Long raterId;

  @Column(name = "rater_name", nullable = false)
  private String raterName;

  @Column(name = "rater_role", nullable = false)
  private String raterRole;

  @Column(name = "property_unit_id")
  private Long propertyUnitId;

  @Column(name = "property_unit_name")
  private String propertyUnitName;

  @Column(name = "rating_date", nullable = false)
  private LocalDate ratingDate;

  @Column(name = "overall_rating", nullable = false)
  private Integer overallRating;

  @Column(name = "professionalism_rating")
  private Integer professionalismRating;

  @Column(name = "responsiveness_rating")
  private Integer responsivenessRating;

  @Column(name = "quality_rating")
  private Integer qualityRating;

  @Column(name = "communication_rating")
  private Integer communicationRating;

  @Column(name = "reliability_rating")
  private Integer reliabilityRating;

  @Column(name = "comments")
  private String comments;

  @Column(name = "positive_aspects")
  private String positiveAspects;

  @Column(name = "improvement_areas")
  private String improvementAreas;

  @Column(name = "rating_period")
  private String ratingPeriod;

  @Column(name = "rating_category")
  private String ratingCategory;

  @Column(name = "is_anonymous")
  private Boolean isAnonymous;

  @Column(name = "is_verified")
  private Boolean isVerified;

  @Column(name = "status")
  private String status;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  public PersonnelRating() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getRatedPersonId() { return ratedPersonId; }
  public void setRatedPersonId(Long ratedPersonId) { this.ratedPersonId = ratedPersonId; }

  public String getRatedPersonName() { return ratedPersonName; }
  public void setRatedPersonName(String ratedPersonName) { this.ratedPersonName = ratedPersonName; }

  public String getRatedPersonRole() { return ratedPersonRole; }
  public void setRatedPersonRole(String ratedPersonRole) { this.ratedPersonRole = ratedPersonRole; }

  public String getRatedPersonType() { return ratedPersonType; }
  public void setRatedPersonType(String ratedPersonType) { this.ratedPersonType = ratedPersonType; }

  public Long getRaterId() { return raterId; }
  public void setRaterId(Long raterId) { this.raterId = raterId; }

  public String getRaterName() { return raterName; }
  public void setRaterName(String raterName) { this.raterName = raterName; }

  public String getRaterRole() { return raterRole; }
  public void setRaterRole(String raterRole) { this.raterRole = raterRole; }

  public Long getPropertyUnitId() { return propertyUnitId; }
  public void setPropertyUnitId(Long propertyUnitId) { this.propertyUnitId = propertyUnitId; }

  public String getPropertyUnitName() { return propertyUnitName; }
  public void setPropertyUnitName(String propertyUnitName) { this.propertyUnitName = propertyUnitName; }

  public LocalDate getRatingDate() { return ratingDate; }
  public void setRatingDate(LocalDate ratingDate) { this.ratingDate = ratingDate; }

  public Integer getOverallRating() { return overallRating; }
  public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }

  public Integer getProfessionalismRating() { return professionalismRating; }
  public void setProfessionalismRating(Integer professionalismRating) { this.professionalismRating = professionalismRating; }

  public Integer getResponsivenessRating() { return responsivenessRating; }
  public void setResponsivenessRating(Integer responsivenessRating) { this.responsivenessRating = responsivenessRating; }

  public Integer getQualityRating() { return qualityRating; }
  public void setQualityRating(Integer qualityRating) { this.qualityRating = qualityRating; }

  public Integer getCommunicationRating() { return communicationRating; }
  public void setCommunicationRating(Integer communicationRating) { this.communicationRating = communicationRating; }

  public Integer getReliabilityRating() { return reliabilityRating; }
  public void setReliabilityRating(Integer reliabilityRating) { this.reliabilityRating = reliabilityRating; }

  public String getComments() { return comments; }
  public void setComments(String comments) { this.comments = comments; }

  public String getPositiveAspects() { return positiveAspects; }
  public void setPositiveAspects(String positiveAspects) { this.positiveAspects = positiveAspects; }

  public String getImprovementAreas() { return improvementAreas; }
  public void setImprovementAreas(String improvementAreas) { this.improvementAreas = improvementAreas; }

  public String getRatingPeriod() { return ratingPeriod; }
  public void setRatingPeriod(String ratingPeriod) { this.ratingPeriod = ratingPeriod; }

  public String getRatingCategory() { return ratingCategory; }
  public void setRatingCategory(String ratingCategory) { this.ratingCategory = ratingCategory; }

  public Boolean getIsAnonymous() { return isAnonymous; }
  public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }

  public Boolean getIsVerified() { return isVerified; }
  public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }
}
