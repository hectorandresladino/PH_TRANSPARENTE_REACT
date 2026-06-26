package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contractors")
public class ContractorController {
  private final ContractorRepository contractorRepository;

  public ContractorController(ContractorRepository contractorRepository) {
    this.contractorRepository = contractorRepository;
  }

  @GetMapping
  public List<Contractor> getAllContractors() {
    return contractorRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Contractor> getContractorById(@PathVariable @NonNull Long id) {
    return contractorRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Contractor> createContractor(@RequestBody Contractor contractor) {
    contractor.setCreatedAt(LocalDate.now());
    if (contractor.getStatus() == null) {
      contractor.setStatus("ACTIVO");
    }
    Contractor savedContractor = contractorRepository.save(contractor);
    return ResponseEntity.ok(savedContractor);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateContractor(@PathVariable @NonNull Long id, @RequestBody Contractor contractor) {
    return contractorRepository.findById(id)
      .map(existingContractor -> {
        existingContractor.setName(contractor.getName());
        existingContractor.setDocumentNumber(contractor.getDocumentNumber());
        existingContractor.setDocumentType(contractor.getDocumentType());
        existingContractor.setNit(contractor.getNit());
        existingContractor.setPhone(contractor.getPhone());
        existingContractor.setEmail(contractor.getEmail());
        existingContractor.setAddress(contractor.getAddress());
        existingContractor.setCity(contractor.getCity());
        existingContractor.setServiceType(contractor.getServiceType());
        existingContractor.setSpecialization(contractor.getSpecialization());
        existingContractor.setStatus(contractor.getStatus());
        existingContractor.setContractNumber(contractor.getContractNumber());
        existingContractor.setContractStartDate(contractor.getContractStartDate());
        existingContractor.setContractEndDate(contractor.getContractEndDate());
        existingContractor.setContractValue(contractor.getContractValue());
        existingContractor.setPaymentTerms(contractor.getPaymentTerms());
        existingContractor.setContactPerson(contractor.getContactPerson());
        existingContractor.setContactPhone(contractor.getContactPhone());
        existingContractor.setObservations(contractor.getObservations());
        existingContractor.setInsurance(contractor.getInsurance());
        existingContractor.setLicense(contractor.getLicense());
        
        Contractor updatedContractor = contractorRepository.save(existingContractor);
        return ResponseEntity.ok(updatedContractor);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteContractor(@PathVariable @NonNull Long id) {
    if (contractorRepository.existsById(id)) {
      contractorRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Contractor> getContractorsByStatus(@PathVariable String status) {
    return contractorRepository.findByStatus(status);
  }

  @GetMapping("/service/{serviceType}")
  public List<Contractor> getContractorsByServiceType(@PathVariable String serviceType) {
    return contractorRepository.findByServiceType(serviceType);
  }

  @GetMapping("/city/{city}")
  public List<Contractor> getContractorsByCity(@PathVariable String city) {
    return contractorRepository.findByCity(city);
  }

  @GetMapping("/contract/{contractNumber}")
  public List<Contractor> getContractorsByContractNumber(@PathVariable String contractNumber) {
    return contractorRepository.findByContractNumber(contractNumber);
  }
}
