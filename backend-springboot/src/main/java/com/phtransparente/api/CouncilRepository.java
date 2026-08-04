package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouncilRepository extends JpaRepository<Council, Long> {
  List<Council> findByOrganizationId(Long organizationId);
  List<Council> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Council> findByOrganizationIdAndRole(Long organizationId, String role);
  List<Council> findByOrganizationIdAndMemberId(Long organizationId, String memberId);
}
