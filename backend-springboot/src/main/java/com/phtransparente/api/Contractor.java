package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "contractors")
public class Contractor {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String documentNumber;

  private String documentType;

  private String nit;

  private String phone;

  private String email;

  private String address;

  private String city;

  private String serviceType;

  private String specialization;

  private String status;

  private String contractNumber;

  @Column(name = "contract_start_date")
  private LocalDate contractStartDate;

  @Column(name = "contract_end_date")
  private LocalDate contractEndDate;

  private String contractValue;

  private String paymentTerms;

  private String contactPerson;

  private String contactPhone;

  private String observations;

  private String insurance;

  private String license;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "created_by")
  private String createdBy;

  public Contractor() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDocumentNumber() { return documentNumber; }
  public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

  public String getDocumentType() { return documentType; }
  public void setDocumentType(String documentType) { this.documentType = documentType; }

  public String getNit() { return nit; }
  public void setNit(String nit) { this.nit = nit; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }

  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }

  public String getServiceType() { return serviceType; }
  public void setServiceType(String serviceType) { this.serviceType = serviceType; }

  public String getSpecialization() { return specialization; }
  public void setSpecialization(String specialization) { this.specialization = specialization; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getContractNumber() { return contractNumber; }
  public void setContractNumber(String contractNumber) { this.contractNumber = contractNumber; }

  public LocalDate getContractStartDate() { return contractStartDate; }
  public void setContractStartDate(LocalDate contractStartDate) { this.contractStartDate = contractStartDate; }

  public LocalDate getContractEndDate() { return contractEndDate; }
  public void setContractEndDate(LocalDate contractEndDate) { this.contractEndDate = contractEndDate; }

  public String getContractValue() { return contractValue; }
  public void setContractValue(String contractValue) { this.contractValue = contractValue; }

  public String getPaymentTerms() { return paymentTerms; }
  public void setPaymentTerms(String paymentTerms) { this.paymentTerms = paymentTerms; }

  public String getContactPerson() { return contactPerson; }
  public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

  public String getContactPhone() { return contactPhone; }
  public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

  public String getObservations() { return observations; }
  public void setObservations(String observations) { this.observations = observations; }

  public String getInsurance() { return insurance; }
  public void setInsurance(String insurance) { this.insurance = insurance; }

  public String getLicense() { return license; }
  public void setLicense(String license) { this.license = license; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
