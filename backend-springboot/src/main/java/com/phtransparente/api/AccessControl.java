package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "access_control")
public class AccessControl {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String accessType;

  private String personName;

  private String documentNumber;

  private String documentType;

  private String vehiclePlate;

  private String vehicleType;

  private String entryGate;

  private String exitGate;

  @Column(name = "entry_time")
  private LocalDateTime entryTime;

  @Column(name = "exit_time")
  private LocalDateTime exitTime;

  private String destination;

  private String purpose;

  private String hostName;

  private String hostUnit;

  @Column(nullable = false)
  private String status;

  private String observations;

  private String authorizedBy;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "created_by")
  private String createdBy;

  public AccessControl() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getAccessType() { return accessType; }
  public void setAccessType(String accessType) { this.accessType = accessType; }

  public String getPersonName() { return personName; }
  public void setPersonName(String personName) { this.personName = personName; }

  public String getDocumentNumber() { return documentNumber; }
  public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

  public String getDocumentType() { return documentType; }
  public void setDocumentType(String documentType) { this.documentType = documentType; }

  public String getVehiclePlate() { return vehiclePlate; }
  public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }

  public String getVehicleType() { return vehicleType; }
  public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

  public String getEntryGate() { return entryGate; }
  public void setEntryGate(String entryGate) { this.entryGate = entryGate; }

  public String getExitGate() { return exitGate; }
  public void setExitGate(String exitGate) { this.exitGate = exitGate; }

  public LocalDateTime getEntryTime() { return entryTime; }
  public void setEntryTime(LocalDateTime entryTime) { this.entryTime = entryTime; }

  public LocalDateTime getExitTime() { return exitTime; }
  public void setExitTime(LocalDateTime exitTime) { this.exitTime = exitTime; }

  public String getDestination() { return destination; }
  public void setDestination(String destination) { this.destination = destination; }

  public String getPurpose() { return purpose; }
  public void setPurpose(String purpose) { this.purpose = purpose; }

  public String getHostName() { return hostName; }
  public void setHostName(String hostName) { this.hostName = hostName; }

  public String getHostUnit() { return hostUnit; }
  public void setHostUnit(String hostUnit) { this.hostUnit = hostUnit; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getObservations() { return observations; }
  public void setObservations(String observations) { this.observations = observations; }

  public String getAuthorizedBy() { return authorizedBy; }
  public void setAuthorizedBy(String authorizedBy) { this.authorizedBy = authorizedBy; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
