package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityPointRepository extends JpaRepository<SecurityPoint, Long> {
  List<SecurityPoint> findByOrganizationId(Long organizationId);
  List<SecurityPoint> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<SecurityPoint> findByOrganizationIdAndType(Long organizationId, String type);
  List<SecurityPoint> findByOrganizationIdAndZone(Long organizationId, String zone);
  List<SecurityPoint> findByOrganizationIdAndAssignedGuard(Long organizationId, String assignedGuard);
}
