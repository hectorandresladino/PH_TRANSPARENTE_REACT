package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Registro de auditoría para cumplimiento de ISO 27001.
 * Almacena quién hizo qué, cuándo y desde dónde.
 */
@Entity
@Table(name = "audit_logs")
public class AuditLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private LocalDateTime timestamp;

  @Column(nullable = false)
  private String action;

  @Column(nullable = false)
  private String username;

  private String role;

  private String description;

  private String entityType;

  private Long entityId;

  private String ipAddress;

  private String result;

  public AuditLog() {}

  public AuditLog(String action, String username, String role, String description, String entityType, Long entityId, String ipAddress, String result) {
    this.timestamp = LocalDateTime.now();
    this.action = action;
    this.username = username;
    this.role = role;
    this.description = description;
    this.entityType = entityType;
    this.entityId = entityId;
    this.ipAddress = ipAddress;
    this.result = result;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public LocalDateTime getTimestamp() { return timestamp; }
  public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

  public String getAction() { return action; }
  public void setAction(String action) { this.action = action; }

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getEntityType() { return entityType; }
  public void setEntityType(String entityType) { this.entityType = entityType; }

  public Long getEntityId() { return entityId; }
  public void setEntityId(Long entityId) { this.entityId = entityId; }

  public String getIpAddress() { return ipAddress; }
  public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

  public String getResult() { return result; }
  public void setResult(String result) { this.result = result; }
}
