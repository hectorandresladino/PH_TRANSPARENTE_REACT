package com.phtransparente.api;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

  private final AuditLogRepository auditLogRepository;

  public AuditLogService(AuditLogRepository auditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  public void log(String action, String username, String role, String description, String entityType, Long entityId, HttpServletRequest request, String result) {
    Long organizationId = TenantContext.getOrganizationId();
    logForOrganization(action, username, role, description, entityType, entityId, request, result,
      organizationId == null ? 0L : organizationId);
  }

  public void logForOrganization(String action, String username, String role, String description,
                                 String entityType, Long entityId, HttpServletRequest request,
                                 String result, Long organizationId) {
    AuditLog log = new AuditLog(action, username, role, description, entityType, entityId,
      getClientIp(request), result, organizationId == null ? 0L : organizationId);
    auditLogRepository.save(log);
  }

  public void log(String action, String username, String role, String description, HttpServletRequest request, String result) {
    log(action, username, role, description, null, null, request, result);
  }

  public void log(String action, String username, String role, String description, String result) {
    log(action, username, role, description, null, null, null, result);
  }

  public List<AuditLog> getRecentLogs() {
    return auditLogRepository.findTop100ByOrganizationIdOrderByTimestampDesc(TenantContext.getOrganizationId());
  }

  public List<AuditLog> getLogsByUsername(String username) {
    return auditLogRepository.findByOrganizationIdAndUsernameOrderByTimestampDesc(TenantContext.getOrganizationId(), username);
  }

  public List<AuditLog> getLogsByAction(String action) {
    return auditLogRepository.findByOrganizationIdAndActionOrderByTimestampDesc(TenantContext.getOrganizationId(), action);
  }

  private String getClientIp(HttpServletRequest request) {
    if (request == null) return null;
    String ip = request.getHeader("X-Forwarded-For");
    if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getHeader("Proxy-Client-IP");
    }
    if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getHeader("WL-Proxy-Client-IP");
    }
    if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getRemoteAddr();
    }
    return ip;
  }
}
