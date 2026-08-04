package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {
  List<Visitor> findByOrganizationId(Long organizationId);
  List<Visitor> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Visitor> findByOrganizationIdAndVisitType(Long organizationId, String visitType);
  List<Visitor> findByOrganizationIdAndHostUnit(Long organizationId, String hostUnit);
  List<Visitor> findByOrganizationIdAndEntryTimeAfter(Long organizationId, LocalDateTime entryTime);
}
