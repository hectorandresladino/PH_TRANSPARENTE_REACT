package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FineRepository extends JpaRepository<Fine, Long> {
  List<Fine> findByOrganizationId(Long organizationId);
  List<Fine> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Fine> findByOrganizationIdAndUserId(Long organizationId, String userId);
  List<Fine> findByOrganizationIdAndUnit(Long organizationId, String unit);
  List<Fine> findByOrganizationIdAndType(Long organizationId, String type);
}
