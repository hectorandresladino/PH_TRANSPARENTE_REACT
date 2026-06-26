package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityGuardRepository extends JpaRepository<SecurityGuard, Long> {
  List<SecurityGuard> findByStatus(String status);
  List<SecurityGuard> findByShift(String shift);
  List<SecurityGuard> findByAssignedZone(String assignedZone);
  List<SecurityGuard> findByAssignedPoint(String assignedPoint);
}
