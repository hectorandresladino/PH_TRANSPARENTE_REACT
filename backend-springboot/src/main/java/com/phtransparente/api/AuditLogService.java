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
    AuditLog log = new AuditLog(action, username, role, description, entityType, entityId, getClientIp(request), result);
    auditLogRepository.save(log);
  }

  public void log(String action, String username, String role, String description, HttpServletRequest request, String result) {
    log(action, username, role, description, null, null, request, result);
  }

  public void log(String action, String username, String role, String description, String result) {
    log(action, username, role, description, null, null, null, result);
  }

  public List<AuditLog> getRecentLogs() {
    return auditLogRepository.findTop100ByOrderByTimestampDesc();
  }

  public List<AuditLog> getLogsByUsername(String username) {
    return auditLogRepository.findByUsernameOrderByTimestampDesc(username);
  }

  public List<AuditLog> getLogsByAction(String action) {
    return auditLogRepository.findByActionOrderByTimestampDesc(action);
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
