package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "security_points")
public class SecurityPoint {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String code;

  private String location;

  private String type;

  private String zone;

  private String description;

  private String status;

  private String assignedGuard;

  private String contactPhone;

  private String equipment;

  private String surveillanceArea;

  private String schedule;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "created_by")
  private String createdBy;

  public SecurityPoint() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getCode() { return code; }
  public void setCode(String code) { this.code = code; }

  public String getLocation() { return location; }
  public void setLocation(String location) { this.location = location; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public String getZone() { return zone; }
  public void setZone(String zone) { this.zone = zone; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getAssignedGuard() { return assignedGuard; }
  public void setAssignedGuard(String assignedGuard) { this.assignedGuard = assignedGuard; }

  public String getContactPhone() { return contactPhone; }
  public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

  public String getEquipment() { return equipment; }
  public void setEquipment(String equipment) { this.equipment = equipment; }

  public String getSurveillanceArea() { return surveillanceArea; }
  public void setSurveillanceArea(String surveillanceArea) { this.surveillanceArea = surveillanceArea; }

  public String getSchedule() { return schedule; }
  public void setSchedule(String schedule) { this.schedule = schedule; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
