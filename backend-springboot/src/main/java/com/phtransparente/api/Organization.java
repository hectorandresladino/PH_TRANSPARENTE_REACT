package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(nullable = false)
  private String name;

  private String nit;
  private String address;
  private String phone;
  private String logoUrl;
  private String primaryColor;

  @Column(nullable = false)
  private String status = "ACTIVE"; // ACTIVE, SUSPENDED, TRIAL, CANCELLED

  @Column(nullable = false)
  private Long planId;

  @Column(nullable = false)
  private Integer maxUsers = 10;

  @Column(nullable = false)
  private Integer maxUnits = 50;

  private LocalDateTime trialEndsAt;

  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getSlug() { return slug; }
  public void setSlug(String slug) { this.slug = slug; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getNit() { return nit; }
  public void setNit(String nit) { this.nit = nit; }

  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getLogoUrl() { return logoUrl; }
  public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

  public String getPrimaryColor() { return primaryColor; }
  public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public Long getPlanId() { return planId; }
  public void setPlanId(Long planId) { this.planId = planId; }

  public Integer getMaxUsers() { return maxUsers; }
  public void setMaxUsers(Integer maxUsers) { this.maxUsers = maxUsers; }

  public Integer getMaxUnits() { return maxUnits; }
  public void setMaxUnits(Integer maxUnits) { this.maxUnits = maxUnits; }

  public LocalDateTime getTrialEndsAt() { return trialEndsAt; }
  public void setTrialEndsAt(LocalDateTime trialEndsAt) { this.trialEndsAt = trialEndsAt; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
