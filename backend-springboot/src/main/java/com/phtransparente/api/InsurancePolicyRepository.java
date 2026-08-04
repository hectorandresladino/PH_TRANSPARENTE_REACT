package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
  List<InsurancePolicy> findByOrganizationId(Long organizationId);
  List<InsurancePolicy> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<InsurancePolicy> findByOrganizationIdAndInsuranceType(Long organizationId, String insuranceType);
  List<InsurancePolicy> findByOrganizationIdAndInsuranceCompany(Long organizationId, String insuranceCompany);
  InsurancePolicy findByOrganizationIdAndPolicyNumber(Long organizationId, String policyNumber);
}
