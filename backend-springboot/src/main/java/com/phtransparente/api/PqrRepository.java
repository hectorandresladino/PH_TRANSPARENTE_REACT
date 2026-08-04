package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PqrRepository extends JpaRepository<Pqr, Long> {
  List<Pqr> findByOrganizationId(Long organizationId);
  List<Pqr> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Pqr> findByOrganizationIdAndType(Long organizationId, String type);
  List<Pqr> findByOrganizationIdAndPriority(Long organizationId, String priority);
  List<Pqr> findByRequester(String requester);
}
