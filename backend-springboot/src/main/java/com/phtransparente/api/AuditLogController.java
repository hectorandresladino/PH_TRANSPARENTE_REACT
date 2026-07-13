package com.phtransparente.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

  private final AuditLogService auditLogService;

  public AuditLogController(AuditLogService auditLogService) {
    this.auditLogService = auditLogService;
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('ADMIN', 'REVISOR_FISCAL')")
  public ResponseEntity<List<AuditLog>> getRecentLogs() {
    return ResponseEntity.ok(auditLogService.getRecentLogs());
  }
}
