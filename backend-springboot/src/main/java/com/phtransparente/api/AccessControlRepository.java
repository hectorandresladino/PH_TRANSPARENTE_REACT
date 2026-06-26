package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessControlRepository extends JpaRepository<AccessControl, Long> {
  List<AccessControl> findByStatus(String status);
  List<AccessControl> findByAccessType(String accessType);
  List<AccessControl> findByEntryGate(String entryGate);
  List<AccessControl> findByEntryTimeBetween(LocalDateTime start, LocalDateTime end);
  List<AccessControl> findByDocumentNumber(String documentNumber);
  List<AccessControl> findByVehiclePlate(String vehiclePlate);
  List<AccessControl> findByHostUnit(String hostUnit);
}
