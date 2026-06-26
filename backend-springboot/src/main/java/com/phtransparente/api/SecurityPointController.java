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
    return securityPointRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<SecurityPoint> getSecurityPointById(@PathVariable @NonNull Long id) {
    return securityPointRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<SecurityPoint> createSecurityPoint(@RequestBody SecurityPoint securityPoint) {
    securityPoint.setCreatedAt(LocalDateTime.now());
    if (securityPoint.getStatus() == null) {
      securityPoint.setStatus("ACTIVO");
    }
    SecurityPoint savedSecurityPoint = securityPointRepository.save(securityPoint);
    return ResponseEntity.ok(savedSecurityPoint);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateSecurityPoint(@PathVariable @NonNull Long id, @RequestBody SecurityPoint securityPoint) {
    return securityPointRepository.findById(id)
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
    if (securityPointRepository.existsById(id)) {
      securityPointRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<SecurityPoint> getSecurityPointsByStatus(@PathVariable String status) {
    return securityPointRepository.findByStatus(status);
  }

  @GetMapping("/type/{type}")
  public List<SecurityPoint> getSecurityPointsByType(@PathVariable String type) {
    return securityPointRepository.findByType(type);
  }

  @GetMapping("/zone/{zone}")
  public List<SecurityPoint> getSecurityPointsByZone(@PathVariable String zone) {
    return securityPointRepository.findByZone(zone);
  }

  @GetMapping("/guard/{guard}")
  public List<SecurityPoint> getSecurityPointsByGuard(@PathVariable String guard) {
    return securityPointRepository.findByAssignedGuard(guard);
  }
}
