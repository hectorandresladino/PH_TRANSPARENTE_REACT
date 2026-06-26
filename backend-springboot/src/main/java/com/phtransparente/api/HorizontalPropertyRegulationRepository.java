package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HorizontalPropertyRegulationRepository extends JpaRepository<HorizontalPropertyRegulation, Long> {
  List<HorizontalPropertyRegulation> findByStatus(String status);
  List<HorizontalPropertyRegulation> findByRegulationVersion(String regulationVersion);
  HorizontalPropertyRegulation findByRegulationNumber(String regulationNumber);
}
