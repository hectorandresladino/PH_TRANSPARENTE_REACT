package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
  List<Alert> findByStatus(String status);
  List<Alert> findBySeverity(String severity);
  List<Alert> findByAlertType(String alertType);
  List<Alert> findByIsPublic(Boolean isPublic);
  List<Alert> findByTargetAudience(String targetAudience);
  List<Alert> findByStatusOrderByAlertDateDesc(String status);
}
