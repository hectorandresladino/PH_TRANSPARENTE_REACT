package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security-points")
public class SecurityPointController {
  private final SecurityPointRepository securityPointRepository;

  public SecurityPointController(SecurityPointRepository securityPointRepository) {
    this.securityPointRepository = securityPointRepository;
  }

  @GetMapping
  public List<SecurityPoint> getAllSecurityPoints() {
    return securityPointRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/{id}")
  public ResponseEntity<SecurityPoint> getSecurityPointById(@PathVariable @NonNull Long id) {
    return securityPointRepository.findById(id)
      .filter(p -> p.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<SecurityPoint> createSecurityPoint(@RequestBody SecurityPoint securityPoint) {
    securityPoint.setOrganizationId(TenantContext.getOrganizationId());
    securityPoint.setCreatedAt(LocalDateTime.now());
    if (securityPoint.getStatus() == null) {
      securityPoint.setStatus("ACTIVO");
    }
    SecurityPoint savedSecurityPoint = securityPointRepository.save(securityPoint);
    return ResponseEntity.ok(savedSecurityPoint);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateSecurityPoint(@PathVariable @NonNull Long id, @RequestBody SecurityPoint securityPoint) {
    Long orgId = TenantContext.getOrganizationId();
    return securityPointRepository.findById(id)
      .filter(existingSecurityPoint -> existingSecurityPoint.getOrganizationId().equals(orgId))
      .map(existingSecurityPoint -> {
        existingSecurityPoint.setName(securityPoint.getName());
        existingSecurityPoint.setCode(securityPoint.getCode());
        existingSecurityPoint.setLocation(securityPoint.getLocation());
        existingSecurityPoint.setType(securityPoint.getType());
        existingSecurityPoint.setZone(securityPoint.getZone());
        existingSecurityPoint.setDescription(securityPoint.getDescription());
        existingSecurityPoint.setStatus(securityPoint.getStatus());
        existingSecurityPoint.setAssignedGuard(securityPoint.getAssignedGuard());
        existingSecurityPoint.setContactPhone(securityPoint.getContactPhone());
        existingSecurityPoint.setEquipment(securityPoint.getEquipment());
        existingSecurityPoint.setSurveillanceArea(securityPoint.getSurveillanceArea());
        existingSecurityPoint.setSchedule(securityPoint.getSchedule());
        
        SecurityPoint updatedSecurityPoint = securityPointRepository.save(existingSecurityPoint);
        return ResponseEntity.ok(updatedSecurityPoint);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteSecurityPoint(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    return securityPointRepository.findById(id)
      .filter(p -> p.getOrganizationId().equals(orgId))
      .map(p -> {
        securityPointRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/status/{status}")
  public List<SecurityPoint> getSecurityPointsByStatus(@PathVariable String status) {
    return securityPointRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/type/{type}")
  public List<SecurityPoint> getSecurityPointsByType(@PathVariable String type) {
    return securityPointRepository.findByOrganizationIdAndType(TenantContext.getOrganizationId(), type);
  }

  @GetMapping("/zone/{zone}")
  public List<SecurityPoint> getSecurityPointsByZone(@PathVariable String zone) {
    return securityPointRepository.findByOrganizationIdAndZone(TenantContext.getOrganizationId(), zone);
  }

  @GetMapping("/guard/{guard}")
  public List<SecurityPoint> getSecurityPointsByGuard(@PathVariable String guard) {
    return securityPointRepository.findByOrganizationIdAndAssignedGuard(TenantContext.getOrganizationId(), guard);
  }
}
