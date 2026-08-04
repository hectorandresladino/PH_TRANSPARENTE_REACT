package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
  private final AlertRepository alertRepository;

  public AlertController(AlertRepository alertRepository) {
    this.alertRepository = alertRepository;
  }

  @GetMapping
  public List<Alert> getAllAlerts() {
    return alertRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/public")
  public List<Alert> getPublicAlerts() {
    return alertRepository.findByOrganizationIdAndIsPublic(TenantContext.getOrganizationId(), true);
  }

  @GetMapping("/audience/{audience}")
  public List<Alert> getAlertsByAudience(@PathVariable String audience) {
    return alertRepository.findByOrganizationIdAndTargetAudience(TenantContext.getOrganizationId(), audience);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Alert> getAlertById(@PathVariable @NonNull Long id) {
    return alertRepository.findById(id)
      .filter(a -> a.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Alert> createAlert(@RequestBody Alert alert) {
    alert.setOrganizationId(TenantContext.getOrganizationId());
    alert.setCreatedAt(LocalDate.now());
    alert.setUpdatedAt(LocalDate.now());
    if (alert.getStatus() == null) {
      alert.setStatus("ACTIVO");
    }
    if (alert.getIsPublic() == null) {
      alert.setIsPublic(true);
    }
    if (alert.getAlertDate() == null) {
      alert.setAlertDate(LocalDate.now());
    }
    Alert savedAlert = alertRepository.save(alert);
    return ResponseEntity.ok(savedAlert);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateAlert(@PathVariable @NonNull Long id, @RequestBody Alert alert) {
    Long orgId = TenantContext.getOrganizationId();
    return alertRepository.findById(id)
      .filter(existingAlert -> existingAlert.getOrganizationId().equals(orgId))
      .map(existingAlert -> {
        existingAlert.setAlertType(alert.getAlertType());
        existingAlert.setSeverity(alert.getSeverity());
        existingAlert.setTitle(alert.getTitle());
        existingAlert.setDescription(alert.getDescription());
        existingAlert.setRelatedModule(alert.getRelatedModule());
        existingAlert.setReferenceId(alert.getReferenceId());
        existingAlert.setAlertDate(alert.getAlertDate());
        existingAlert.setExpiryDate(alert.getExpiryDate());
        existingAlert.setStatus(alert.getStatus());
        existingAlert.setAssignedTo(alert.getAssignedTo());
        existingAlert.setIsPublic(alert.getIsPublic());
        existingAlert.setTargetAudience(alert.getTargetAudience());
        existingAlert.setObservations(alert.getObservations());
        existingAlert.setUpdatedAt(LocalDate.now());
        existingAlert.setResolvedAt(alert.getResolvedAt());
        existingAlert.setResolvedBy(alert.getResolvedBy());
        existingAlert.setResolutionNotes(alert.getResolutionNotes());
        
        Alert updatedAlert = alertRepository.save(existingAlert);
        return ResponseEntity.ok(updatedAlert);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteAlert(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    return alertRepository.findById(id)
      .filter(a -> a.getOrganizationId().equals(orgId))
      .map(a -> {
        alertRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/status/{status}")
  public List<Alert> getAlertsByStatus(@PathVariable String status) {
    return alertRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/severity/{severity}")
  public List<Alert> getAlertsBySeverity(@PathVariable String severity) {
    return alertRepository.findByOrganizationIdAndSeverity(TenantContext.getOrganizationId(), severity);
  }

  @GetMapping("/type/{alertType}")
  public List<Alert> getAlertsByType(@PathVariable String alertType) {
    return alertRepository.findByOrganizationIdAndAlertType(TenantContext.getOrganizationId(), alertType);
  }

  @PutMapping("/{id}/resolve")
  public ResponseEntity<?> resolveAlert(@PathVariable @NonNull Long id, @RequestBody Alert resolution) {
    Long orgId = TenantContext.getOrganizationId();
    return alertRepository.findById(id)
      .filter(existingAlert -> existingAlert.getOrganizationId().equals(orgId))
      .map(existingAlert -> {
        existingAlert.setStatus("RESUELTO");
        existingAlert.setResolvedAt(LocalDate.now());
        existingAlert.setResolvedBy(resolution.getResolvedBy());
        existingAlert.setResolutionNotes(resolution.getResolutionNotes());
        existingAlert.setUpdatedAt(LocalDate.now());
        
        Alert updatedAlert = alertRepository.save(existingAlert);
        return ResponseEntity.ok(updatedAlert);
      })
      .orElse(ResponseEntity.notFound().build());
  }
}
