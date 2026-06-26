package com.phtransparente.api;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fines")
public class Fine {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String fineNumber;

  @Column(nullable = false)
  private String type;

  private String description;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal amount;

  private String currency;

  @Column(nullable = false)
  private String userId;

  private String userName;

  private String unit;

  @Column(nullable = false)
  private String status;

  @Column(name = "due_date")
  private LocalDate dueDate;

  @Column(name = "payment_date")
  private LocalDate paymentDate;

  @Column(name = "created_at")
  private LocalDate createdAt;

  public Fine() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getFineNumber() { return fineNumber; }
  public void setFineNumber(String fineNumber) { this.fineNumber = fineNumber; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }

  public String getCurrency() { return currency; }
  public void setCurrency(String currency) { this.currency = currency; }

  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }

  public String getUserName() { return userName; }
  public void setUserName(String userName) { this.userName = userName; }

  public String getUnit() { return unit; }
  public void setUnit(String unit) { this.unit = unit; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public LocalDate getDueDate() { return dueDate; }
  public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

  public LocalDate getPaymentDate() { return paymentDate; }
  public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
