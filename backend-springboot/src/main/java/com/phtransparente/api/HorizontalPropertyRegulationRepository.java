package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorizontalPropertyRegulationRepository extends JpaRepository<HorizontalPropertyRegulation, Long> {
  List<HorizontalPropertyRegulation> findByOrganizationId(Long organizationId);
  List<HorizontalPropertyRegulation> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<HorizontalPropertyRegulation> findByOrganizationIdAndRegulationVersion(Long organizationId, String regulationVersion);
  HorizontalPropertyRegulation findByOrganizationIdAndRegulationNumber(Long organizationId, String regulationNumber);
}
