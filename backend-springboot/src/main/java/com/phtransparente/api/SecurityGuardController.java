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
    return securityGuardRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<SecurityGuard> getSecurityGuardById(@PathVariable @NonNull Long id) {
    return securityGuardRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<SecurityGuard> createSecurityGuard(@RequestBody SecurityGuard securityGuard) {
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
    return securityGuardRepository.findById(id)
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
    if (securityGuardRepository.existsById(id)) {
      securityGuardRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<SecurityGuard> getSecurityGuardsByStatus(@PathVariable String status) {
    return securityGuardRepository.findByStatus(status);
  }

  @GetMapping("/shift/{shift}")
  public List<SecurityGuard> getSecurityGuardsByShift(@PathVariable String shift) {
    return securityGuardRepository.findByShift(shift);
  }

  @GetMapping("/zone/{zone}")
  public List<SecurityGuard> getSecurityGuardsByZone(@PathVariable String zone) {
    return securityGuardRepository.findByAssignedZone(zone);
  }

  @GetMapping("/point/{point}")
  public List<SecurityGuard> getSecurityGuardsByPoint(@PathVariable String point) {
    return securityGuardRepository.findByAssignedPoint(point);
  }
}
