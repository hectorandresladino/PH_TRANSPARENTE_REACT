package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/annual-budgets")
public class AnnualBudgetController {
  private final AnnualBudgetRepository annualBudgetRepository;

  public AnnualBudgetController(AnnualBudgetRepository annualBudgetRepository) {
    this.annualBudgetRepository = annualBudgetRepository;
  }

  @GetMapping
  public List<AnnualBudget> getAllAnnualBudgets() {
    return annualBudgetRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<AnnualBudget> getAnnualBudgetById(@PathVariable @NonNull Long id) {
    return annualBudgetRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<AnnualBudget> createAnnualBudget(@RequestBody AnnualBudget annualBudget) {
    annualBudget.setCreatedAt(LocalDate.now());
    annualBudget.setUpdatedAt(LocalDate.now());
    if (annualBudget.getStatus() == null) {
      annualBudget.setStatus("BORRADOR");
    }
    AnnualBudget savedAnnualBudget = annualBudgetRepository.save(annualBudget);
    return ResponseEntity.ok(savedAnnualBudget);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateAnnualBudget(@PathVariable @NonNull Long id, @RequestBody AnnualBudget annualBudget) {
    return annualBudgetRepository.findById(id)
      .map(existingAnnualBudget -> {
        existingAnnualBudget.setBudgetYear(annualBudget.getBudgetYear());
        existingAnnualBudget.setBudgetName(annualBudget.getBudgetName());
        existingAnnualBudget.setDescription(annualBudget.getDescription());
        existingAnnualBudget.setTotalBudgetedAmount(annualBudget.getTotalBudgetedAmount());
        existingAnnualBudget.setTotalExecutedAmount(annualBudget.getTotalExecutedAmount());
        existingAnnualBudget.setTotalRemainingAmount(annualBudget.getTotalRemainingAmount());
        existingAnnualBudget.setExecutionPercentage(annualBudget.getExecutionPercentage());
        existingAnnualBudget.setApprovalDate(annualBudget.getApprovalDate());
        existingAnnualBudget.setApprovedBy(annualBudget.getApprovedBy());
        existingAnnualBudget.setAssemblyResolution(annualBudget.getAssemblyResolution());
        existingAnnualBudget.setStatus(annualBudget.getStatus());
        existingAnnualBudget.setBudgetType(annualBudget.getBudgetType());
        existingAnnualBudget.setUpdatedAt(LocalDate.now());
        existingAnnualBudget.setUpdatedBy(annualBudget.getUpdatedBy());
        
        AnnualBudget updatedAnnualBudget = annualBudgetRepository.save(existingAnnualBudget);
        return ResponseEntity.ok(updatedAnnualBudget);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteAnnualBudget(@PathVariable @NonNull Long id) {
    if (annualBudgetRepository.existsById(id)) {
      annualBudgetRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/year/{budgetYear}")
  public List<AnnualBudget> getAnnualBudgetsByYear(@PathVariable Integer budgetYear) {
    return annualBudgetRepository.findByBudgetYear(budgetYear);
  }

  @GetMapping("/status/{status}")
  public List<AnnualBudget> getAnnualBudgetsByStatus(@PathVariable String status) {
    return annualBudgetRepository.findByStatus(status);
  }

  @GetMapping("/type/{budgetType}")
  public List<AnnualBudget> getAnnualBudgetsByType(@PathVariable String budgetType) {
    return annualBudgetRepository.findByBudgetType(budgetType);
  }
}
