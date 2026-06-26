package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
public class Visitor {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String documentNumber;

  private String documentType;

  private String phone;

  private String hostUserId;

  private String hostName;

  private String hostUnit;

  @Column(nullable = false)
  private String visitType;

  private String purpose;

  @Column(name = "entry_time")
  private LocalDateTime entryTime;

  @Column(name = "exit_time")
  private LocalDateTime exitTime;

  @Column(nullable = false)
  private String status;

  private String vehiclePlate;

  private String notes;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  public Visitor() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDocumentNumber() { return documentNumber; }
  public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

  public String getDocumentType() { return documentType; }
  public void setDocumentType(String documentType) { this.documentType = documentType; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getHostUserId() { return hostUserId; }
  public void setHostUserId(String hostUserId) { this.hostUserId = hostUserId; }

  public String getHostName() { return hostName; }
  public void setHostName(String hostName) { this.hostName = hostName; }

  public String getHostUnit() { return hostUnit; }
  public void setHostUnit(String hostUnit) { this.hostUnit = hostUnit; }

  public String getVisitType() { return visitType; }
  public void setVisitType(String visitType) { this.visitType = visitType; }

  public String getPurpose() { return purpose; }
  public void setPurpose(String purpose) { this.purpose = purpose; }

  public LocalDateTime getEntryTime() { return entryTime; }
  public void setEntryTime(LocalDateTime entryTime) { this.entryTime = entryTime; }

  public LocalDateTime getExitTime() { return exitTime; }
  public void setExitTime(LocalDateTime exitTime) { this.exitTime = exitTime; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getVehiclePlate() { return vehiclePlate; }
  public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }

  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
