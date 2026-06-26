package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityEventRepository extends JpaRepository<SecurityEvent, Long> {
  List<SecurityEvent> findByStatus(String status);
  List<SecurityEvent> findByType(String type);
  List<SecurityEvent> findBySeverity(String severity);
  List<SecurityEvent> findByZone(String zone);
  List<SecurityEvent> findByAssignedTo(String assignedTo);
  List<SecurityEvent> findByReportedBy(String reportedBy);
}
