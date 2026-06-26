package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "module_authorizations")
public class ModuleAuthorization {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "module_name", nullable = false)
  private String moduleName;

  @Column(name = "permission_type", nullable = false)
  private String permissionType;

  @Column(name = "granted_by", nullable = false)
  private Long grantedBy;

  @Column(name = "granted_date")
  private LocalDate grantedDate;

  @Column(name = "expiry_date")
  private LocalDate expiryDate;

  private String status;

  @Column(name = "authorization_reason")
  private String authorizationReason;

  @Column(name = "is_permanent")
  private Boolean isPermanent;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  @Column(name = "revoked_by")
  private Long revokedBy;

  @Column(name = "revoked_date")
  private LocalDate revokedDate;

  @Column(name = "revocation_reason")
  private String revocationReason;

  public ModuleAuthorization() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Long getUserId() { return userId; }
  public void setUserId(Long userId) { this.userId = userId; }

  public String getModuleName() { return moduleName; }
  public void setModuleName(String moduleName) { this.moduleName = moduleName; }

  public String getPermissionType() { return permissionType; }
  public void setPermissionType(String permissionType) { this.permissionType = permissionType; }

  public Long getGrantedBy() { return grantedBy; }
  public void setGrantedBy(Long grantedBy) { this.grantedBy = grantedBy; }

  public LocalDate getGrantedDate() { return grantedDate; }
  public void setGrantedDate(LocalDate grantedDate) { this.grantedDate = grantedDate; }

  public LocalDate getExpiryDate() { return expiryDate; }
  public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getAuthorizationReason() { return authorizationReason; }
  public void setAuthorizationReason(String authorizationReason) { this.authorizationReason = authorizationReason; }

  public Boolean getIsPermanent() { return isPermanent; }
  public void setIsPermanent(Boolean isPermanent) { this.isPermanent = isPermanent; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

  public Long getRevokedBy() { return revokedBy; }
  public void setRevokedBy(Long revokedBy) { this.revokedBy = revokedBy; }

  public LocalDate getRevokedDate() { return revokedDate; }
  public void setRevokedDate(LocalDate revokedDate) { this.revokedDate = revokedDate; }

  public String getRevocationReason() { return revocationReason; }
  public void setRevocationReason(String revocationReason) { this.revocationReason = revocationReason; }
}
