package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/official-minutes")
public class OfficialMinutesBookController {
  private final OfficialMinutesBookRepository officialMinutesBookRepository;

  public OfficialMinutesBookController(OfficialMinutesBookRepository officialMinutesBookRepository) {
    this.officialMinutesBookRepository = officialMinutesBookRepository;
  }

  @GetMapping
  public List<OfficialMinutesBook> getAllOfficialMinutes() {
    return officialMinutesBookRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/{id}")
  public ResponseEntity<OfficialMinutesBook> getOfficialMinuteById(@PathVariable @NonNull Long id) {
    return officialMinutesBookRepository.findById(id)
      .filter(m -> m.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<OfficialMinutesBook> createOfficialMinute(@RequestBody OfficialMinutesBook officialMinutesBook) {
    officialMinutesBook.setOrganizationId(TenantContext.getOrganizationId());
    officialMinutesBook.setCreatedAt(LocalDate.now());
    officialMinutesBook.setUpdatedAt(LocalDate.now());
    if (officialMinutesBook.getStatus() == null) {
      officialMinutesBook.setStatus("BORRADOR");
    }
    OfficialMinutesBook savedOfficialMinutesBook = officialMinutesBookRepository.save(officialMinutesBook);
    return ResponseEntity.ok(savedOfficialMinutesBook);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateOfficialMinute(@PathVariable @NonNull Long id, @RequestBody OfficialMinutesBook officialMinutesBook) {
    Long orgId = TenantContext.getOrganizationId();
    return officialMinutesBookRepository.findById(id)
      .filter(existingOfficialMinutesBook -> existingOfficialMinutesBook.getOrganizationId().equals(orgId))
      .map(existingOfficialMinutesBook -> {
        existingOfficialMinutesBook.setMinuteNumber(officialMinutesBook.getMinuteNumber());
        existingOfficialMinutesBook.setAssemblyType(officialMinutesBook.getAssemblyType());
        existingOfficialMinutesBook.setMeetingDate(officialMinutesBook.getMeetingDate());
        existingOfficialMinutesBook.setMeetingTime(officialMinutesBook.getMeetingTime());
        existingOfficialMinutesBook.setMeetingLocation(officialMinutesBook.getMeetingLocation());
        existingOfficialMinutesBook.setCallMethod(officialMinutesBook.getCallMethod());
        existingOfficialMinutesBook.setQuorumPresent(officialMinutesBook.getQuorumPresent());
        existingOfficialMinutesBook.setQuorumPercentage(officialMinutesBook.getQuorumPercentage());
        existingOfficialMinutesBook.setTotalUnits(officialMinutesBook.getTotalUnits());
        existingOfficialMinutesBook.setUnitsPresent(officialMinutesBook.getUnitsPresent());
        existingOfficialMinutesBook.setUnitsRepresented(officialMinutesBook.getUnitsRepresented());
        existingOfficialMinutesBook.setAgendaItems(officialMinutesBook.getAgendaItems());
        existingOfficialMinutesBook.setDecisionsMade(officialMinutesBook.getDecisionsMade());
        existingOfficialMinutesBook.setVotesFor(officialMinutesBook.getVotesFor());
        existingOfficialMinutesBook.setVotesAgainst(officialMinutesBook.getVotesAgainst());
        existingOfficialMinutesBook.setVotesAbstained(officialMinutesBook.getVotesAbstained());
        existingOfficialMinutesBook.setPresidentName(officialMinutesBook.getPresidentName());
        existingOfficialMinutesBook.setSecretaryName(officialMinutesBook.getSecretaryName());
        existingOfficialMinutesBook.setPresidentSignature(officialMinutesBook.getPresidentSignature());
        existingOfficialMinutesBook.setSecretarySignature(officialMinutesBook.getSecretarySignature());
        existingOfficialMinutesBook.setApprovalDate(officialMinutesBook.getApprovalDate());
        existingOfficialMinutesBook.setApprovedBy(officialMinutesBook.getApprovedBy());
        existingOfficialMinutesBook.setStatus(officialMinutesBook.getStatus());
        existingOfficialMinutesBook.setMinuteDocument(officialMinutesBook.getMinuteDocument());
        existingOfficialMinutesBook.setAttachments(officialMinutesBook.getAttachments());
        existingOfficialMinutesBook.setObservations(officialMinutesBook.getObservations());
        existingOfficialMinutesBook.setUpdatedAt(LocalDate.now());
        existingOfficialMinutesBook.setUpdatedBy(officialMinutesBook.getUpdatedBy());
        
        OfficialMinutesBook updatedOfficialMinutesBook = officialMinutesBookRepository.save(existingOfficialMinutesBook);
        return ResponseEntity.ok(updatedOfficialMinutesBook);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteOfficialMinute(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    return officialMinutesBookRepository.findById(id)
      .filter(m -> m.getOrganizationId().equals(orgId))
      .map(m -> {
        officialMinutesBookRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/status/{status}")
  public List<OfficialMinutesBook> getOfficialMinutesByStatus(@PathVariable String status) {
    return officialMinutesBookRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/type/{assemblyType}")
  public List<OfficialMinutesBook> getOfficialMinutesByType(@PathVariable String assemblyType) {
    return officialMinutesBookRepository.findByOrganizationIdAndAssemblyType(TenantContext.getOrganizationId(), assemblyType);
  }

  @GetMapping("/date-range")
  public List<OfficialMinutesBook> getOfficialMinutesByDateRange(
    @RequestParam LocalDate startDate,
    @RequestParam LocalDate endDate
  ) {
    return officialMinutesBookRepository.findByOrganizationIdAndMeetingDateBetween(TenantContext.getOrganizationId(), startDate, endDate);
  }
}
