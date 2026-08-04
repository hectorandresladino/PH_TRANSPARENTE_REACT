package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
  List<Alert> findByOrganizationId(Long organizationId);
  List<Alert> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Alert> findByOrganizationIdAndSeverity(Long organizationId, String severity);
  List<Alert> findByOrganizationIdAndAlertType(Long organizationId, String alertType);
  List<Alert> findByOrganizationIdAndIsPublic(Long organizationId, Boolean isPublic);
  List<Alert> findByOrganizationIdAndTargetAudience(Long organizationId, String targetAudience);
  List<Alert> findByOrganizationIdAndStatusOrderByAlertDateDesc(Long organizationId, String status);
}
