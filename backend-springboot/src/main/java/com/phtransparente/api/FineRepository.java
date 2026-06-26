package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FineRepository extends JpaRepository<Fine, Long> {
  List<Fine> findByStatus(String status);
  List<Fine> findByUserId(String userId);
  List<Fine> findByUnit(String unit);
  List<Fine> findByType(String type);
}
