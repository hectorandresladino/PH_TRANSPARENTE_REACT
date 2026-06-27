package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_codes")
public class VerificationCode {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String username;

  @Column(nullable = false, unique = true)
  private String code;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime expiresAt;

  @Column(nullable = false)
  private Boolean used = false;

  public VerificationCode() {}

  public VerificationCode(String username, String code, LocalDateTime expiresAt) {
    this.username = username;
    this.code = code;
    this.createdAt = LocalDateTime.now();
    this.expiresAt = expiresAt;
    this.used = false;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public String getCode() { return code; }
  public void setCode(String code) { this.code = code; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getExpiresAt() { return expiresAt; }
  public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

  public Boolean getUsed() { return used; }
  public void setUsed(Boolean used) { this.used = used; }

  public boolean isExpired() {
    return LocalDateTime.now().isAfter(expiresAt);
  }
}
