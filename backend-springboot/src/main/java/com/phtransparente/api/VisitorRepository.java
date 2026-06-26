package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {
  List<Visitor> findByStatus(String status);
  List<Visitor> findByVisitType(String visitType);
  List<Visitor> findByHostUnit(String hostUnit);
  List<Visitor> findByEntryTimeAfter(LocalDateTime entryTime);
}
