package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {
  private final ContractRepository contractRepository;

  public ContractController(ContractRepository contractRepository) {
    this.contractRepository = contractRepository;
  }

  @GetMapping
  public List<Contract> getAllContracts() {
    return contractRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Contract> getContractById(@PathVariable @NonNull Long id) {
    return contractRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Contract> createContract(@RequestBody Contract contract) {
    contract.setCreatedAt(LocalDate.now());
    if (contract.getStatus() == null) {
      contract.setStatus("ACTIVO");
    }
    if (contract.getCurrency() == null) {
      contract.setCurrency("COP");
    }
    Contract savedContract = contractRepository.save(contract);
    return ResponseEntity.ok(savedContract);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateContract(@PathVariable @NonNull Long id, @RequestBody Contract contract) {
    return contractRepository.findById(id)
      .map(existingContract -> {
        existingContract.setContractNumber(contract.getContractNumber());
        existingContract.setType(contract.getType());
        existingContract.setProviderName(contract.getProviderName());
        existingContract.setProviderDocument(contract.getProviderDocument());
        existingContract.setDescription(contract.getDescription());
        existingContract.setAmount(contract.getAmount());
        existingContract.setCurrency(contract.getCurrency());
        existingContract.setStartDate(contract.getStartDate());
        existingContract.setEndDate(contract.getEndDate());
        existingContract.setStatus(contract.getStatus());
        existingContract.setTerms(contract.getTerms());
        
        Contract updatedContract = contractRepository.save(existingContract);
        return ResponseEntity.ok(updatedContract);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteContract(@PathVariable @NonNull Long id) {
    if (contractRepository.existsById(id)) {
      contractRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Contract> getContractsByStatus(@PathVariable String status) {
    return contractRepository.findByStatus(status);
  }

  @GetMapping("/type/{type}")
  public List<Contract> getContractsByType(@PathVariable String type) {
    return contractRepository.findByType(type);
  }

  @GetMapping("/provider/{providerName}")
  public List<Contract> getContractsByProvider(@PathVariable String providerName) {
    return contractRepository.findByProviderName(providerName);
  }
}
