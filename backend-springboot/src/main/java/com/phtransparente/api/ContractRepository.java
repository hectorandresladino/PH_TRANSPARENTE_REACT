package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contract, Long> {
  List<Contract> findByOrganizationId(Long organizationId);
  List<Contract> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Contract> findByOrganizationIdAndType(Long organizationId, String type);
  List<Contract> findByOrganizationIdAndProviderName(Long organizationId, String providerName);
}
