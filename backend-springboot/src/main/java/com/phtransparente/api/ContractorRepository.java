package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractorRepository extends JpaRepository<Contractor, Long> {
  List<Contractor> findByOrganizationId(Long organizationId);
  List<Contractor> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Contractor> findByOrganizationIdAndServiceType(Long organizationId, String serviceType);
  List<Contractor> findByOrganizationIdAndCity(Long organizationId, String city);
  Contractor findByOrganizationIdAndContractNumber(Long organizationId, String contractNumber);
}
