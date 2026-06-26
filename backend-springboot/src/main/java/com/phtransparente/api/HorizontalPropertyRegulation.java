package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "horizontal_property_regulations")
public class HorizontalPropertyRegulation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String regulationNumber;

  @Column(nullable = false)
  private String regulationName;

  private String description;

  @Column(name = "approval_date")
  private LocalDate approvalDate;

  @Column(name = "approved_by")
  private String approvedBy;

  @Column(name = "assembly_resolution")
  private String assemblyResolution;

  @Column(name = "registration_date")
  private LocalDate registrationDate;

  @Column(name = "registration_number")
  private String registrationNumber;

  @Column(name = "notary_office")
  private String notaryOffice;

  @Column(name = "notary_city")
  private String notaryCity;

  private String status;

  @Column(name = "regulation_version")
  private String regulationVersion;

  @Column(name = "effective_date")
  private LocalDate effectiveDate;

  @Column(name = "expiry_date")
  private LocalDate expiryDate;

  @Column(name = "total_units")
  private Integer totalUnits;

  @Column(name = "common_areas_description")
  private String commonAreasDescription;

  @Column(name = "private_areas_description")
  private String privateAreasDescription;

  @Column(name = "use_restrictions")
  private String useRestrictions;

  @Column(name = "maintenance_obligations")
  private String maintenanceObligations;

  @Column(name = "payment_obligations")
  private String paymentObligations;

  @Column(name = "coownership_coefficients")
  private String coownershipCoefficients;

  @Column(name = "meeting_rules")
  private String meetingRules;

  @Column(name = "voting_rules")
  private String votingRules;

  @Column(name = "sanctions")
  private String sanctions;

  @Column(name = "dispute_resolution")
  private String disputeResolution;

  @Column(name = "amendment_procedure")
  private String amendmentProcedure;

  @Column(name = "regulation_document")
  private String regulationDocument;

  @Column(name = "attachments")
  private String attachments;

  private String observations;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  @Column(name = "updated_by")
  private String updatedBy;

  public HorizontalPropertyRegulation() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getRegulationNumber() { return regulationNumber; }
  public void setRegulationNumber(String regulationNumber) { this.regulationNumber = regulationNumber; }

  public String getRegulationName() { return regulationName; }
  public void setRegulationName(String regulationName) { this.regulationName = regulationName; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public LocalDate getApprovalDate() { return approvalDate; }
  public void setApprovalDate(LocalDate approvalDate) { this.approvalDate = approvalDate; }

  public String getApprovedBy() { return approvedBy; }
  public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

  public String getAssemblyResolution() { return assemblyResolution; }
  public void setAssemblyResolution(String assemblyResolution) { this.assemblyResolution = assemblyResolution; }

  public LocalDate getRegistrationDate() { return registrationDate; }
  public void setRegistrationDate(LocalDate registrationDate) { this.registrationDate = registrationDate; }

  public String getRegistrationNumber() { return registrationNumber; }
  public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

  public String getNotaryOffice() { return notaryOffice; }
  public void setNotaryOffice(String notaryOffice) { this.notaryOffice = notaryOffice; }

  public String getNotaryCity() { return notaryCity; }
  public void setNotaryCity(String notaryCity) { this.notaryCity = notaryCity; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getRegulationVersion() { return regulationVersion; }
  public void setRegulationVersion(String regulationVersion) { this.regulationVersion = regulationVersion; }

  public LocalDate getEffectiveDate() { return effectiveDate; }
  public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

  public LocalDate getExpiryDate() { return expiryDate; }
  public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

  public Integer getTotalUnits() { return totalUnits; }
  public void setTotalUnits(Integer totalUnits) { this.totalUnits = totalUnits; }

  public String getCommonAreasDescription() { return commonAreasDescription; }
  public void setCommonAreasDescription(String commonAreasDescription) { this.commonAreasDescription = commonAreasDescription; }

  public String getPrivateAreasDescription() { return privateAreasDescription; }
  public void setPrivateAreasDescription(String privateAreasDescription) { this.privateAreasDescription = privateAreasDescription; }

  public String getUseRestrictions() { return useRestrictions; }
  public void setUseRestrictions(String useRestrictions) { this.useRestrictions = useRestrictions; }

  public String getMaintenanceObligations() { return maintenanceObligations; }
  public void setMaintenanceObligations(String maintenanceObligations) { this.maintenanceObligations = maintenanceObligations; }

  public String getPaymentObligations() { return paymentObligations; }
  public void setPaymentObligations(String paymentObligations) { this.paymentObligations = paymentObligations; }

  public String getCoownershipCoefficients() { return coownershipCoefficients; }
  public void setCoownershipCoefficients(String coownershipCoefficients) { this.coownershipCoefficients = coownershipCoefficients; }

  public String getMeetingRules() { return meetingRules; }
  public void setMeetingRules(String meetingRules) { this.meetingRules = meetingRules; }

  public String getVotingRules() { return votingRules; }
  public void setVotingRules(String votingRules) { this.votingRules = votingRules; }

  public String getSanctions() { return sanctions; }
  public void setSanctions(String sanctions) { this.sanctions = sanctions; }

  public String getDisputeResolution() { return disputeResolution; }
  public void setDisputeResolution(String disputeResolution) { this.disputeResolution = disputeResolution; }

  public String getAmendmentProcedure() { return amendmentProcedure; }
  public void setAmendmentProcedure(String amendmentProcedure) { this.amendmentProcedure = amendmentProcedure; }

  public String getRegulationDocument() { return regulationDocument; }
  public void setRegulationDocument(String regulationDocument) { this.regulationDocument = regulationDocument; }

  public String getAttachments() { return attachments; }
  public void setAttachments(String attachments) { this.attachments = attachments; }

  public String getObservations() { return observations; }
  public void setObservations(String observations) { this.observations = observations; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

  public String getUpdatedBy() { return updatedBy; }
  public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
