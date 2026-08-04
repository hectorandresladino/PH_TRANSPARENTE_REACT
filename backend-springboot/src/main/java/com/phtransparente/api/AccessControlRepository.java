package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessControlRepository extends JpaRepository<AccessControl, Long> {
  List<AccessControl> findByOrganizationId(Long organizationId);
  List<AccessControl> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<AccessControl> findByOrganizationIdAndAccessType(Long organizationId, String accessType);
  List<AccessControl> findByOrganizationIdAndEntryGate(Long organizationId, String entryGate);
  List<AccessControl> findByOrganizationIdAndEntryTimeBetween(Long organizationId, LocalDateTime start, LocalDateTime end);
  List<AccessControl> findByOrganizationIdAndDocumentNumber(Long organizationId, String documentNumber);
  List<AccessControl> findByOrganizationIdAndVehiclePlate(Long organizationId, String vehiclePlate);
  List<AccessControl> findByOrganizationIdAndHostUnit(Long organizationId, String hostUnit);
}
