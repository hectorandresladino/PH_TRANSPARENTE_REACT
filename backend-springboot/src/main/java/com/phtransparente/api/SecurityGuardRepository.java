package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityGuardRepository extends JpaRepository<SecurityGuard, Long> {
  List<SecurityGuard> findByOrganizationId(Long organizationId);
  List<SecurityGuard> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<SecurityGuard> findByOrganizationIdAndShift(Long organizationId, String shift);
  List<SecurityGuard> findByOrganizationIdAndAssignedZone(Long organizationId, String assignedZone);
  List<SecurityGuard> findByOrganizationIdAndAssignedPoint(Long organizationId, String assignedPoint);
}
