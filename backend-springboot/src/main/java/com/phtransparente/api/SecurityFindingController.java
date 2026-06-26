package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security-findings")
public class SecurityFindingController {
  private final SecurityFindingRepository securityFindingRepository;

  public SecurityFindingController(SecurityFindingRepository securityFindingRepository) {
    this.securityFindingRepository = securityFindingRepository;
  }

  @GetMapping
  public List<SecurityFinding> getAllSecurityFindings() {
    return securityFindingRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<SecurityFinding> getSecurityFindingById(@PathVariable @NonNull Long id) {
    return securityFindingRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<SecurityFinding> createSecurityFinding(@RequestBody SecurityFinding securityFinding) {
    securityFinding.setCreatedAt(LocalDateTime.now());
    if (securityFinding.getStatus() == null) {
      securityFinding.setStatus("PENDIENTE");
    }
    if (securityFinding.getReportedDate() == null) {
      securityFinding.setReportedDate(LocalDateTime.now());
    }
    if (securityFinding.getSeverity() == null) {
      securityFinding.setSeverity("MEDIA");
    }
    if (securityFinding.getPriority() == null) {
      securityFinding.setPriority("NORMAL");
    }
    SecurityFinding savedSecurityFinding = securityFindingRepository.save(securityFinding);
    return ResponseEntity.ok(savedSecurityFinding);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateSecurityFinding(@PathVariable @NonNull Long id, @RequestBody SecurityFinding securityFinding) {
    return securityFindingRepository.findById(id)
      .map(existingSecurityFinding -> {
        existingSecurityFinding.setTitle(securityFinding.getTitle());
        existingSecurityFinding.setDescription(securityFinding.getDescription());
        existingSecurityFinding.setType(securityFinding.getType());
        existingSecurityFinding.setSeverity(securityFinding.getSeverity());
        existingSecurityFinding.setLocation(securityFinding.getLocation());
        existingSecurityFinding.setZone(securityFinding.getZone());
        existingSecurityFinding.setStatus(securityFinding.getStatus());
        existingSecurityFinding.setReportedBy(securityFinding.getReportedBy());
        existingSecurityFinding.setAssignedTo(securityFinding.getAssignedTo());
        existingSecurityFinding.setReportedDate(securityFinding.getReportedDate());
        existingSecurityFinding.setResolution(securityFinding.getResolution());
        existingSecurityFinding.setActionTaken(securityFinding.getActionTaken());
        existingSecurityFinding.setEvidence(securityFinding.getEvidence());
        existingSecurityFinding.setPriority(securityFinding.getPriority());
        existingSecurityFinding.setCategory(securityFinding.getCategory());
        
        if ("RESUELTO".equals(securityFinding.getStatus()) && existingSecurityFinding.getResolvedDate() == null) {
          existingSecurityFinding.setResolvedDate(LocalDateTime.now());
        }
        
        SecurityFinding updatedSecurityFinding = securityFindingRepository.save(existingSecurityFinding);
        return ResponseEntity.ok(updatedSecurityFinding);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteSecurityFinding(@PathVariable @NonNull Long id) {
    if (securityFindingRepository.existsById(id)) {
      securityFindingRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<SecurityFinding> getSecurityFindingsByStatus(@PathVariable String status) {
    return securityFindingRepository.findByStatus(status);
  }

  @GetMapping("/type/{type}")
  public List<SecurityFinding> getSecurityFindingsByType(@PathVariable String type) {
    return securityFindingRepository.findByType(type);
  }

  @GetMapping("/severity/{severity}")
  public List<SecurityFinding> getSecurityFindingsBySeverity(@PathVariable String severity) {
    return securityFindingRepository.findBySeverity(severity);
  }

  @GetMapping("/zone/{zone}")
  public List<SecurityFinding> getSecurityFindingsByZone(@PathVariable String zone) {
    return securityFindingRepository.findByZone(zone);
  }

  @GetMapping("/assigned/{assignedTo}")
  public List<SecurityFinding> getSecurityFindingsByAssigned(@PathVariable String assignedTo) {
    return securityFindingRepository.findByAssignedTo(assignedTo);
  }

  @GetMapping("/reported/{reportedBy}")
  public List<SecurityFinding> getSecurityFindingsByReported(@PathVariable String reportedBy) {
    return securityFindingRepository.findByReportedBy(reportedBy);
  }
}
