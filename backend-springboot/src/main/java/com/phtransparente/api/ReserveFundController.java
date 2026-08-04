package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reserve-funds")
public class ReserveFundController {
  private final ReserveFundRepository reserveFundRepository;

  public ReserveFundController(ReserveFundRepository reserveFundRepository) {
    this.reserveFundRepository = reserveFundRepository;
  }

  @GetMapping
  public List<ReserveFund> getAllReserveFunds() {
    return reserveFundRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ReserveFund> getReserveFundById(@PathVariable @NonNull Long id) {
    return reserveFundRepository.findById(id)
      .filter(r -> r.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<ReserveFund> createReserveFund(@RequestBody ReserveFund reserveFund) {
    reserveFund.setOrganizationId(TenantContext.getOrganizationId());
    reserveFund.setCreatedAt(LocalDate.now());
    reserveFund.setUpdatedAt(LocalDate.now());
    if (reserveFund.getStatus() == null) {
      reserveFund.setStatus("ACTIVO");
    }
    if (reserveFund.getRequiredPercentage() == null) {
      reserveFund.setRequiredPercentage(10.0); // 10% según Superintendencia
    }
    ReserveFund savedReserveFund = reserveFundRepository.save(reserveFund);
    return ResponseEntity.ok(savedReserveFund);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateReserveFund(@PathVariable @NonNull Long id, @RequestBody ReserveFund reserveFund) {
    Long orgId = TenantContext.getOrganizationId();
    return reserveFundRepository.findById(id)
      .filter(existingReserveFund -> existingReserveFund.getOrganizationId().equals(orgId))
      .map(existingReserveFund -> {
        existingReserveFund.setFundName(reserveFund.getFundName());
        existingReserveFund.setDescription(reserveFund.getDescription());
        existingReserveFund.setTotalAmount(reserveFund.getTotalAmount());
        existingReserveFund.setCurrentBalance(reserveFund.getCurrentBalance());
        existingReserveFund.setRequiredPercentage(reserveFund.getRequiredPercentage());
        existingReserveFund.setRequiredAmount(reserveFund.getRequiredAmount());
        existingReserveFund.setAccumulatedAmount(reserveFund.getAccumulatedAmount());
        existingReserveFund.setLastContributionDate(reserveFund.getLastContributionDate());
        existingReserveFund.setNextContributionDate(reserveFund.getNextContributionDate());
        existingReserveFund.setContributionFrequency(reserveFund.getContributionFrequency());
        existingReserveFund.setStatus(reserveFund.getStatus());
        existingReserveFund.setFundType(reserveFund.getFundType());
        existingReserveFund.setApprovalDate(reserveFund.getApprovalDate());
        existingReserveFund.setApprovedBy(reserveFund.getApprovedBy());
        existingReserveFund.setAssemblyResolution(reserveFund.getAssemblyResolution());
        existingReserveFund.setBankAccount(reserveFund.getBankAccount());
        existingReserveFund.setInvestmentType(reserveFund.getInvestmentType());
        existingReserveFund.setInvestmentReturn(reserveFund.getInvestmentReturn());
        existingReserveFund.setLastAuditDate(reserveFund.getLastAuditDate());
        existingReserveFund.setNextAuditDate(reserveFund.getNextAuditDate());
        existingReserveFund.setObservations(reserveFund.getObservations());
        existingReserveFund.setUpdatedAt(LocalDate.now());
        existingReserveFund.setUpdatedBy(reserveFund.getUpdatedBy());
        
        ReserveFund updatedReserveFund = reserveFundRepository.save(existingReserveFund);
        return ResponseEntity.ok(updatedReserveFund);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteReserveFund(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    return reserveFundRepository.findById(id)
      .filter(r -> r.getOrganizationId().equals(orgId))
      .map(r -> {
        reserveFundRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/status/{status}")
  public List<ReserveFund> getReserveFundsByStatus(@PathVariable String status) {
    return reserveFundRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/type/{fundType}")
  public List<ReserveFund> getReserveFundsByType(@PathVariable String fundType) {
    return reserveFundRepository.findByOrganizationIdAndFundType(TenantContext.getOrganizationId(), fundType);
  }
}
