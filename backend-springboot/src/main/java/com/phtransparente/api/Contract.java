package com.phtransparente.api;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contracts")
public class Contract {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String contractNumber;

  @Column(nullable = false)
  private String type;

  @Column(nullable = false)
  private String providerName;

  private String providerDocument;

  private String description;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal amount;

  private String currency;

  @Column(name = "start_date")
  private LocalDate startDate;

  @Column(name = "end_date")
  private LocalDate endDate;

  @Column(nullable = false)
  private String status;

  private String terms;

  @Column(name = "created_at")
  private LocalDate createdAt;

  public Contract() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getContractNumber() { return contractNumber; }
  public void setContractNumber(String contractNumber) { this.contractNumber = contractNumber; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public String getProviderName() { return providerName; }
  public void setProviderName(String providerName) { this.providerName = providerName; }

  public String getProviderDocument() { return providerDocument; }
  public void setProviderDocument(String providerDocument) { this.providerDocument = providerDocument; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }

  public String getCurrency() { return currency; }
  public void setCurrency(String currency) { this.currency = currency; }

  public LocalDate getStartDate() { return startDate; }
  public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

  public LocalDate getEndDate() { return endDate; }
  public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getTerms() { return terms; }
  public void setTerms(String terms) { this.terms = terms; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
