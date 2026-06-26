package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "insurance_policies")
public class InsurancePolicy {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String policyNumber;

  @Column(nullable = false)
  private String insuranceCompany;

  @Column(name = "insurance_type", nullable = false)
  private String insuranceType;

  @Column(name = "coverage_amount")
  private String coverageAmount;

  @Column(name = "annual_premium")
  private String annualPremium;

  @Column(name = "policy_start_date")
  private LocalDate policyStartDate;

  @Column(name = "policy_end_date")
  private LocalDate policyEndDate;

  @Column(name = "renewal_date")
  private LocalDate renewalDate;

  private String status;

  @Column(name = "deductible")
  private String deductible;

  @Column(name = "coverage_details")
  private String coverageDetails;

  @Column(name = "exclusions")
  private String exclusions;

  @Column(name = "insured_property")
  private String insuredProperty;

  @Column(name = "beneficiary")
  private String beneficiary;

  @Column(name = "contact_person")
  private String contactPerson;

  @Column(name = "contact_phone")
  private String contactPhone;

  @Column(name = "contact_email")
  private String contactEmail;

  @Column(name = "payment_frequency")
  private String paymentFrequency;

  @Column(name = "payment_method")
  private String paymentMethod;

  @Column(name = "last_payment_date")
  private LocalDate lastPaymentDate;

  @Column(name = "next_payment_date")
  private LocalDate nextPaymentDate;

  @Column(name = "claim_history")
  private String claimHistory;

  @Column(name = "policy_document")
  private String policyDocument;

  private String observations;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  @Column(name = "updated_by")
  private String updatedBy;

  public InsurancePolicy() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getPolicyNumber() { return policyNumber; }
  public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

  public String getInsuranceCompany() { return insuranceCompany; }
  public void setInsuranceCompany(String insuranceCompany) { this.insuranceCompany = insuranceCompany; }

  public String getInsuranceType() { return insuranceType; }
  public void setInsuranceType(String insuranceType) { this.insuranceType = insuranceType; }

  public String getCoverageAmount() { return coverageAmount; }
  public void setCoverageAmount(String coverageAmount) { this.coverageAmount = coverageAmount; }

  public String getAnnualPremium() { return annualPremium; }
  public void setAnnualPremium(String annualPremium) { this.annualPremium = annualPremium; }

  public LocalDate getPolicyStartDate() { return policyStartDate; }
  public void setPolicyStartDate(LocalDate policyStartDate) { this.policyStartDate = policyStartDate; }

  public LocalDate getPolicyEndDate() { return policyEndDate; }
  public void setPolicyEndDate(LocalDate policyEndDate) { this.policyEndDate = policyEndDate; }

  public LocalDate getRenewalDate() { return renewalDate; }
  public void setRenewalDate(LocalDate renewalDate) { this.renewalDate = renewalDate; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getDeductible() { return deductible; }
  public void setDeductible(String deductible) { this.deductible = deductible; }

  public String getCoverageDetails() { return coverageDetails; }
  public void setCoverageDetails(String coverageDetails) { this.coverageDetails = coverageDetails; }

  public String getExclusions() { return exclusions; }
  public void setExclusions(String exclusions) { this.exclusions = exclusions; }

  public String getInsuredProperty() { return insuredProperty; }
  public void setInsuredProperty(String insuredProperty) { this.insuredProperty = insuredProperty; }

  public String getBeneficiary() { return beneficiary; }
  public void setBeneficiary(String beneficiary) { this.beneficiary = beneficiary; }

  public String getContactPerson() { return contactPerson; }
  public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

  public String getContactPhone() { return contactPhone; }
  public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

  public String getContactEmail() { return contactEmail; }
  public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

  public String getPaymentFrequency() { return paymentFrequency; }
  public void setPaymentFrequency(String paymentFrequency) { this.paymentFrequency = paymentFrequency; }

  public String getPaymentMethod() { return paymentMethod; }
  public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

  public LocalDate getLastPaymentDate() { return lastPaymentDate; }
  public void setLastPaymentDate(LocalDate lastPaymentDate) { this.lastPaymentDate = lastPaymentDate; }

  public LocalDate getNextPaymentDate() { return nextPaymentDate; }
  public void setNextPaymentDate(LocalDate nextPaymentDate) { this.nextPaymentDate = nextPaymentDate; }

  public String getClaimHistory() { return claimHistory; }
  public void setClaimHistory(String claimHistory) { this.claimHistory = claimHistory; }

  public String getPolicyDocument() { return policyDocument; }
  public void setPolicyDocument(String policyDocument) { this.policyDocument = policyDocument; }

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
