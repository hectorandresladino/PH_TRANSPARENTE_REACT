package com.phtransparente.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

  List<AuditLog> findTop100ByOrganizationIdOrderByTimestampDesc(Long organizationId);

  List<AuditLog> findByOrganizationIdAndUsernameOrderByTimestampDesc(Long organizationId, String username);

  List<AuditLog> findByOrganizationIdAndActionOrderByTimestampDesc(Long organizationId, String action);

  List<AuditLog> findByOrganizationIdOrderByTimestampDesc(Long organizationId);
}
