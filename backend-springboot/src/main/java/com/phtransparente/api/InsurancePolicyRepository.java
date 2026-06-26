package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
  List<InsurancePolicy> findByStatus(String status);
  List<InsurancePolicy> findByInsuranceType(String insuranceType);
  List<InsurancePolicy> findByInsuranceCompany(String insuranceCompany);
  InsurancePolicy findByPolicyNumber(String policyNumber);
}
