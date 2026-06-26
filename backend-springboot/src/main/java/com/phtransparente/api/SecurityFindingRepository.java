package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityFindingRepository extends JpaRepository<SecurityFinding, Long> {
  List<SecurityFinding> findByStatus(String status);
  List<SecurityFinding> findByType(String type);
  List<SecurityFinding> findBySeverity(String severity);
  List<SecurityFinding> findByZone(String zone);
  List<SecurityFinding> findByAssignedTo(String assignedTo);
  List<SecurityFinding> findByReportedBy(String reportedBy);
}
