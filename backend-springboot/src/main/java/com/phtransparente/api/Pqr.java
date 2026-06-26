package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pqrs")
public class Pqr {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String type;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false)
  private String requester;

  private String email;
  private String phone;

  @Column(nullable = false)
  private String status;

  private String priority;

  private String response;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Column(name = "resolved_at")
  private LocalDateTime resolvedAt;

  public Pqr() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getRequester() { return requester; }
  public void setRequester(String requester) { this.requester = requester; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getPriority() { return priority; }
  public void setPriority(String priority) { this.priority = priority; }

  public String getResponse() { return response; }
  public void setResponse(String response) { this.response = response; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

  public LocalDateTime getResolvedAt() { return resolvedAt; }
  public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
