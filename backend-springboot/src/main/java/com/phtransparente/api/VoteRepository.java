package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
  List<Vote> findByOrganizationId(Long organizationId);
  List<Vote> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Vote> findByOrganizationIdAndType(Long organizationId, String type);
  List<Vote> findByOrganizationIdAndAssemblyId(Long organizationId, Long assemblyId);
  List<Vote> findByOrganizationIdAndCreatedBy(Long organizationId, String createdBy);
}
