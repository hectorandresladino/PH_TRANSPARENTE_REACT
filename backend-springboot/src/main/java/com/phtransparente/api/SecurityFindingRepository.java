package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityFindingRepository extends JpaRepository<SecurityFinding, Long> {
  List<SecurityFinding> findByOrganizationId(Long organizationId);
  List<SecurityFinding> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<SecurityFinding> findByOrganizationIdAndType(Long organizationId, String type);
  List<SecurityFinding> findByOrganizationIdAndSeverity(Long organizationId, String severity);
  List<SecurityFinding> findByOrganizationIdAndZone(Long organizationId, String zone);
  List<SecurityFinding> findByOrganizationIdAndAssignedTo(Long organizationId, String assignedTo);
  List<SecurityFinding> findByOrganizationIdAndReportedBy(Long organizationId, String reportedBy);
}
