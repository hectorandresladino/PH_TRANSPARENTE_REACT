package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contract, Long> {
  List<Contract> findByStatus(String status);
  List<Contract> findByType(String type);
  List<Contract> findByProviderName(String providerName);
}
