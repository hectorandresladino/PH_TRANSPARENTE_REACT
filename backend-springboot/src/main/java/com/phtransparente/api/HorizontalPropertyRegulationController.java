package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/horizontal-property-regulations")
public class HorizontalPropertyRegulationController {
  private final HorizontalPropertyRegulationRepository horizontalPropertyRegulationRepository;

  public HorizontalPropertyRegulationController(HorizontalPropertyRegulationRepository horizontalPropertyRegulationRepository) {
    this.horizontalPropertyRegulationRepository = horizontalPropertyRegulationRepository;
  }

  @GetMapping
  public List<HorizontalPropertyRegulation> getAllHorizontalPropertyRegulations() {
    return horizontalPropertyRegulationRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<HorizontalPropertyRegulation> getHorizontalPropertyRegulationById(@PathVariable @NonNull Long id) {
    return horizontalPropertyRegulationRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<HorizontalPropertyRegulation> createHorizontalPropertyRegulation(@RequestBody HorizontalPropertyRegulation horizontalPropertyRegulation) {
    horizontalPropertyRegulation.setCreatedAt(LocalDate.now());
    horizontalPropertyRegulation.setUpdatedAt(LocalDate.now());
    if (horizontalPropertyRegulation.getStatus() == null) {
      horizontalPropertyRegulation.setStatus("BORRADOR");
    }
    HorizontalPropertyRegulation savedHorizontalPropertyRegulation = horizontalPropertyRegulationRepository.save(horizontalPropertyRegulation);
    return ResponseEntity.ok(savedHorizontalPropertyRegulation);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateHorizontalPropertyRegulation(@PathVariable @NonNull Long id, @RequestBody HorizontalPropertyRegulation horizontalPropertyRegulation) {
    return horizontalPropertyRegulationRepository.findById(id)
      .map(existingHorizontalPropertyRegulation -> {
        existingHorizontalPropertyRegulation.setRegulationNumber(horizontalPropertyRegulation.getRegulationNumber());
        existingHorizontalPropertyRegulation.setRegulationName(horizontalPropertyRegulation.getRegulationName());
        existingHorizontalPropertyRegulation.setDescription(horizontalPropertyRegulation.getDescription());
        existingHorizontalPropertyRegulation.setApprovalDate(horizontalPropertyRegulation.getApprovalDate());
        existingHorizontalPropertyRegulation.setApprovedBy(horizontalPropertyRegulation.getApprovedBy());
        existingHorizontalPropertyRegulation.setAssemblyResolution(horizontalPropertyRegulation.getAssemblyResolution());
        existingHorizontalPropertyRegulation.setRegistrationDate(horizontalPropertyRegulation.getRegistrationDate());
        existingHorizontalPropertyRegulation.setRegistrationNumber(horizontalPropertyRegulation.getRegistrationNumber());
        existingHorizontalPropertyRegulation.setNotaryOffice(horizontalPropertyRegulation.getNotaryOffice());
        existingHorizontalPropertyRegulation.setNotaryCity(horizontalPropertyRegulation.getNotaryCity());
        existingHorizontalPropertyRegulation.setStatus(horizontalPropertyRegulation.getStatus());
        existingHorizontalPropertyRegulation.setRegulationVersion(horizontalPropertyRegulation.getRegulationVersion());
        existingHorizontalPropertyRegulation.setEffectiveDate(horizontalPropertyRegulation.getEffectiveDate());
        existingHorizontalPropertyRegulation.setExpiryDate(horizontalPropertyRegulation.getExpiryDate());
        existingHorizontalPropertyRegulation.setTotalUnits(horizontalPropertyRegulation.getTotalUnits());
        existingHorizontalPropertyRegulation.setCommonAreasDescription(horizontalPropertyRegulation.getCommonAreasDescription());
        existingHorizontalPropertyRegulation.setPrivateAreasDescription(horizontalPropertyRegulation.getPrivateAreasDescription());
        existingHorizontalPropertyRegulation.setUseRestrictions(horizontalPropertyRegulation.getUseRestrictions());
        existingHorizontalPropertyRegulation.setMaintenanceObligations(horizontalPropertyRegulation.getMaintenanceObligations());
        existingHorizontalPropertyRegulation.setPaymentObligations(horizontalPropertyRegulation.getPaymentObligations());
        existingHorizontalPropertyRegulation.setCoownershipCoefficients(horizontalPropertyRegulation.getCoownershipCoefficients());
        existingHorizontalPropertyRegulation.setMeetingRules(horizontalPropertyRegulation.getMeetingRules());
        existingHorizontalPropertyRegulation.setVotingRules(horizontalPropertyRegulation.getVotingRules());
        existingHorizontalPropertyRegulation.setSanctions(horizontalPropertyRegulation.getSanctions());
        existingHorizontalPropertyRegulation.setDisputeResolution(horizontalPropertyRegulation.getDisputeResolution());
        existingHorizontalPropertyRegulation.setAmendmentProcedure(horizontalPropertyRegulation.getAmendmentProcedure());
        existingHorizontalPropertyRegulation.setRegulationDocument(horizontalPropertyRegulation.getRegulationDocument());
        existingHorizontalPropertyRegulation.setAttachments(horizontalPropertyRegulation.getAttachments());
        existingHorizontalPropertyRegulation.setObservations(horizontalPropertyRegulation.getObservations());
        existingHorizontalPropertyRegulation.setUpdatedAt(LocalDate.now());
        existingHorizontalPropertyRegulation.setUpdatedBy(horizontalPropertyRegulation.getUpdatedBy());
        
        HorizontalPropertyRegulation updatedHorizontalPropertyRegulation = horizontalPropertyRegulationRepository.save(existingHorizontalPropertyRegulation);
        return ResponseEntity.ok(updatedHorizontalPropertyRegulation);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteHorizontalPropertyRegulation(@PathVariable @NonNull Long id) {
    if (horizontalPropertyRegulationRepository.existsById(id)) {
      horizontalPropertyRegulationRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<HorizontalPropertyRegulation> getHorizontalPropertyRegulationsByStatus(@PathVariable String status) {
    return horizontalPropertyRegulationRepository.findByStatus(status);
  }

  @GetMapping("/version/{regulationVersion}")
  public List<HorizontalPropertyRegulation> getHorizontalPropertyRegulationsByVersion(@PathVariable String regulationVersion) {
    return horizontalPropertyRegulationRepository.findByRegulationVersion(regulationVersion);
  }
}
