package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "security_guards")
public class SecurityGuard {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String documentNumber;

  private String documentType;

  private String phone;

  private String email;

  private String shift;

  private String schedule;

  private String assignedZone;

  private String assignedPoint;

  private String status;

  private String uniformSize;

  private String equipment;

  private String certifications;

  private String emergencyContact;

  private String emergencyPhone;

  @Column(name = "hire_date")
  private LocalDate hireDate;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "created_by")
  private String createdBy;

  public SecurityGuard() {}

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

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getShift() { return shift; }
  public void setShift(String shift) { this.shift = shift; }

  public String getSchedule() { return schedule; }
  public void setSchedule(String schedule) { this.schedule = schedule; }

  public String getAssignedZone() { return assignedZone; }
  public void setAssignedZone(String assignedZone) { this.assignedZone = assignedZone; }

  public String getAssignedPoint() { return assignedPoint; }
  public void setAssignedPoint(String assignedPoint) { this.assignedPoint = assignedPoint; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getUniformSize() { return uniformSize; }
  public void setUniformSize(String uniformSize) { this.uniformSize = uniformSize; }

  public String getEquipment() { return equipment; }
  public void setEquipment(String equipment) { this.equipment = equipment; }

  public String getCertifications() { return certifications; }
  public void setCertifications(String certifications) { this.certifications = certifications; }

  public String getEmergencyContact() { return emergencyContact; }
  public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

  public String getEmergencyPhone() { return emergencyPhone; }
  public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }

  public LocalDate getHireDate() { return hireDate; }
  public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
