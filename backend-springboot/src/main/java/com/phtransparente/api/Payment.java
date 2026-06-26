package com.phtransparente.api;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
public class Payment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String invoiceNumber;

  @Column(nullable = false)
  private String concept;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal amount;

  @Column(nullable = false)
  private String status;

  private String paymentMethod;

  private String referenceNumber;

  @Column(name = "due_date")
  private LocalDate dueDate;

  @Column(name = "payment_date")
  private LocalDate paymentDate;

  @Column(name = "created_at")
  private LocalDate createdAt;

  private String description;
  private String userId;

  public Payment() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getInvoiceNumber() { return invoiceNumber; }
  public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

  public String getConcept() { return concept; }
  public void setConcept(String concept) { this.concept = concept; }

  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getPaymentMethod() { return paymentMethod; }
  public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

  public String getReferenceNumber() { return referenceNumber; }
  public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

  public LocalDate getDueDate() { return dueDate; }
  public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

  public LocalDate getPaymentDate() { return paymentDate; }
  public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
}
