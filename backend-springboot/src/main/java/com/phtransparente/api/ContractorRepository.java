package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractorRepository extends JpaRepository<Contractor, Long> {
  List<Contractor> findByStatus(String status);
  List<Contractor> findByServiceType(String serviceType);
  List<Contractor> findByCity(String city);
  List<Contractor> findByContractNumber(String contractNumber);
}
