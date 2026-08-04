package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssemblyRepository extends JpaRepository<Assembly, Long> {
  List<Assembly> findByOrganizationId(Long organizationId);
  List<Assembly> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Assembly> findByOrganizationIdAndType(Long organizationId, String type);
  List<Assembly> findByOrganizationIdAndCreatedBy(Long organizationId, String createdBy);
}
