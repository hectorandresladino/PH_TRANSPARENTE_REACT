package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insurance-policies")
public class InsurancePolicyController {
  private final InsurancePolicyRepository insurancePolicyRepository;

  public InsurancePolicyController(InsurancePolicyRepository insurancePolicyRepository) {
    this.insurancePolicyRepository = insurancePolicyRepository;
  }

  @GetMapping
  public List<InsurancePolicy> getAllInsurancePolicies() {
    return insurancePolicyRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<InsurancePolicy> getInsurancePolicyById(@PathVariable @NonNull Long id) {
    return insurancePolicyRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<InsurancePolicy> createInsurancePolicy(@RequestBody InsurancePolicy insurancePolicy) {
    insurancePolicy.setCreatedAt(LocalDate.now());
    insurancePolicy.setUpdatedAt(LocalDate.now());
    if (insurancePolicy.getStatus() == null) {
      insurancePolicy.setStatus("ACTIVO");
    }
    InsurancePolicy savedInsurancePolicy = insurancePolicyRepository.save(insurancePolicy);
    return ResponseEntity.ok(savedInsurancePolicy);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateInsurancePolicy(@PathVariable @NonNull Long id, @RequestBody InsurancePolicy insurancePolicy) {
    return insurancePolicyRepository.findById(id)
      .map(existingInsurancePolicy -> {
        existingInsurancePolicy.setPolicyNumber(insurancePolicy.getPolicyNumber());
        existingInsurancePolicy.setInsuranceCompany(insurancePolicy.getInsuranceCompany());
        existingInsurancePolicy.setInsuranceType(insurancePolicy.getInsuranceType());
        existingInsurancePolicy.setCoverageAmount(insurancePolicy.getCoverageAmount());
        existingInsurancePolicy.setAnnualPremium(insurancePolicy.getAnnualPremium());
        existingInsurancePolicy.setPolicyStartDate(insurancePolicy.getPolicyStartDate());
        existingInsurancePolicy.setPolicyEndDate(insurancePolicy.getPolicyEndDate());
        existingInsurancePolicy.setRenewalDate(insurancePolicy.getRenewalDate());
        existingInsurancePolicy.setStatus(insurancePolicy.getStatus());
        existingInsurancePolicy.setDeductible(insurancePolicy.getDeductible());
        existingInsurancePolicy.setCoverageDetails(insurancePolicy.getCoverageDetails());
        existingInsurancePolicy.setExclusions(insurancePolicy.getExclusions());
        existingInsurancePolicy.setInsuredProperty(insurancePolicy.getInsuredProperty());
        existingInsurancePolicy.setBeneficiary(insurancePolicy.getBeneficiary());
        existingInsurancePolicy.setContactPerson(insurancePolicy.getContactPerson());
        existingInsurancePolicy.setContactPhone(insurancePolicy.getContactPhone());
        existingInsurancePolicy.setContactEmail(insurancePolicy.getContactEmail());
        existingInsurancePolicy.setPaymentFrequency(insurancePolicy.getPaymentFrequency());
        existingInsurancePolicy.setPaymentMethod(insurancePolicy.getPaymentMethod());
        existingInsurancePolicy.setLastPaymentDate(insurancePolicy.getLastPaymentDate());
        existingInsurancePolicy.setNextPaymentDate(insurancePolicy.getNextPaymentDate());
        existingInsurancePolicy.setClaimHistory(insurancePolicy.getClaimHistory());
        existingInsurancePolicy.setPolicyDocument(insurancePolicy.getPolicyDocument());
        existingInsurancePolicy.setObservations(insurancePolicy.getObservations());
        existingInsurancePolicy.setUpdatedAt(LocalDate.now());
        existingInsurancePolicy.setUpdatedBy(insurancePolicy.getUpdatedBy());
        
        InsurancePolicy updatedInsurancePolicy = insurancePolicyRepository.save(existingInsurancePolicy);
        return ResponseEntity.ok(updatedInsurancePolicy);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteInsurancePolicy(@PathVariable @NonNull Long id) {
    if (insurancePolicyRepository.existsById(id)) {
      insurancePolicyRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<InsurancePolicy> getInsurancePoliciesByStatus(@PathVariable String status) {
    return insurancePolicyRepository.findByStatus(status);
  }

  @GetMapping("/type/{insuranceType}")
  public List<InsurancePolicy> getInsurancePoliciesByType(@PathVariable String insuranceType) {
    return insurancePolicyRepository.findByInsuranceType(insuranceType);
  }

  @GetMapping("/company/{insuranceCompany}")
  public List<InsurancePolicy> getInsurancePoliciesByCompany(@PathVariable String insuranceCompany) {
    return insurancePolicyRepository.findByInsuranceCompany(insuranceCompany);
  }
}
