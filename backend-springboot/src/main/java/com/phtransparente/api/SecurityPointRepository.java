package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityPointRepository extends JpaRepository<SecurityPoint, Long> {
  List<SecurityPoint> findByStatus(String status);
  List<SecurityPoint> findByType(String type);
  List<SecurityPoint> findByZone(String zone);
  List<SecurityPoint> findByAssignedGuard(String assignedGuard);
}
