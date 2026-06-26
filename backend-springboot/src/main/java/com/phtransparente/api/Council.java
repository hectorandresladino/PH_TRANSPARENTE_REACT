package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "councils")
public class Council {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String description;

  @Column(nullable = false)
  private String role;

  @Column(name = "member_id")
  private String memberId;

  @Column(name = "member_name")
  private String memberName;

  @Column(name = "start_date")
  private LocalDate startDate;

  @Column(name = "end_date")
  private LocalDate endDate;

  @Column(nullable = false)
  private String status;

  @Column(name = "contact_email")
  private String contactEmail;

  @Column(name = "contact_phone")
  private String contactPhone;

  @Column(name = "created_at")
  private LocalDate createdAt;

  public Council() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }

  public String getMemberId() { return memberId; }
  public void setMemberId(String memberId) { this.memberId = memberId; }

  public String getMemberName() { return memberName; }
  public void setMemberName(String memberName) { this.memberName = memberName; }

  public LocalDate getStartDate() { return startDate; }
  public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

  public LocalDate getEndDate() { return endDate; }
  public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getContactEmail() { return contactEmail; }
  public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

  public String getContactPhone() { return contactPhone; }
  public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
