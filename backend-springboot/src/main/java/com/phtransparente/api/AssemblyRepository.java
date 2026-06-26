package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssemblyRepository extends JpaRepository<Assembly, Long> {
  List<Assembly> findByStatus(String status);
  List<Assembly> findByType(String type);
  List<Assembly> findByCreatedBy(String createdBy);
}
