package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security-guards")
public class SecurityGuardController {
  private final SecurityGuardRepository securityGuardRepository;

  public SecurityGuardController(SecurityGuardRepository securityGuardRepository) {
    this.securityGuardRepository = securityGuardRepository;
  }

  @GetMapping
  public List<SecurityGuard> getAllSecurityGuards() {
    return securityGuardRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/{id}")
  public ResponseEntity<SecurityGuard> getSecurityGuardById(@PathVariable @NonNull Long id) {
    return securityGuardRepository.findById(id)
      .filter(g -> g.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<SecurityGuard> createSecurityGuard(@RequestBody SecurityGuard securityGuard) {
    securityGuard.setOrganizationId(TenantContext.getOrganizationId());
    securityGuard.setCreatedAt(LocalDate.now());
    if (securityGuard.getStatus() == null) {
      securityGuard.setStatus("ACTIVO");
    }
    if (securityGuard.getHireDate() == null) {
      securityGuard.setHireDate(LocalDate.now());
    }
    SecurityGuard savedSecurityGuard = securityGuardRepository.save(securityGuard);
    return ResponseEntity.ok(savedSecurityGuard);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateSecurityGuard(@PathVariable @NonNull Long id, @RequestBody SecurityGuard securityGuard) {
    Long orgId = TenantContext.getOrganizationId();
    return securityGuardRepository.findById(id)
      .filter(existingSecurityGuard -> existingSecurityGuard.getOrganizationId().equals(orgId))
      .map(existingSecurityGuard -> {
        existingSecurityGuard.setName(securityGuard.getName());
        existingSecurityGuard.setDocumentNumber(securityGuard.getDocumentNumber());
        existingSecurityGuard.setDocumentType(securityGuard.getDocumentType());
        existingSecurityGuard.setPhone(securityGuard.getPhone());
        existingSecurityGuard.setEmail(securityGuard.getEmail());
        existingSecurityGuard.setShift(securityGuard.getShift());
        existingSecurityGuard.setSchedule(securityGuard.getSchedule());
        existingSecurityGuard.setAssignedZone(securityGuard.getAssignedZone());
        existingSecurityGuard.setAssignedPoint(securityGuard.getAssignedPoint());
        existingSecurityGuard.setStatus(securityGuard.getStatus());
        existingSecurityGuard.setUniformSize(securityGuard.getUniformSize());
        existingSecurityGuard.setEquipment(securityGuard.getEquipment());
        existingSecurityGuard.setCertifications(securityGuard.getCertifications());
        existingSecurityGuard.setEmergencyContact(securityGuard.getEmergencyContact());
        existingSecurityGuard.setEmergencyPhone(securityGuard.getEmergencyPhone());
        existingSecurityGuard.setHireDate(securityGuard.getHireDate());
        
        SecurityGuard updatedSecurityGuard = securityGuardRepository.save(existingSecurityGuard);
        return ResponseEntity.ok(updatedSecurityGuard);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteSecurityGuard(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    return securityGuardRepository.findById(id)
      .filter(g -> g.getOrganizationId().equals(orgId))
      .map(g -> {
        securityGuardRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/status/{status}")
  public List<SecurityGuard> getSecurityGuardsByStatus(@PathVariable String status) {
    return securityGuardRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/shift/{shift}")
  public List<SecurityGuard> getSecurityGuardsByShift(@PathVariable String shift) {
    return securityGuardRepository.findByOrganizationIdAndShift(TenantContext.getOrganizationId(), shift);
  }

  @GetMapping("/zone/{zone}")
  public List<SecurityGuard> getSecurityGuardsByZone(@PathVariable String zone) {
    return securityGuardRepository.findByOrganizationIdAndAssignedZone(TenantContext.getOrganizationId(), zone);
  }

  @GetMapping("/point/{point}")
  public List<SecurityGuard> getSecurityGuardsByPoint(@PathVariable String point) {
    return securityGuardRepository.findByOrganizationIdAndAssignedPoint(TenantContext.getOrganizationId(), point);
  }
}
