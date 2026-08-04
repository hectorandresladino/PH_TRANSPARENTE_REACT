package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityEventRepository extends JpaRepository<SecurityEvent, Long> {
  List<SecurityEvent> findByOrganizationId(Long organizationId);
  List<SecurityEvent> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<SecurityEvent> findByOrganizationIdAndType(Long organizationId, String type);
  List<SecurityEvent> findByOrganizationIdAndSeverity(Long organizationId, String severity);
  List<SecurityEvent> findByOrganizationIdAndZone(Long organizationId, String zone);
  List<SecurityEvent> findByOrganizationIdAndAssignedTo(Long organizationId, String assignedTo);
  List<SecurityEvent> findByOrganizationIdAndReportedBy(Long organizationId, String reportedBy);
}
