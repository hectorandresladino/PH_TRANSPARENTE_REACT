package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security-events")
public class SecurityEventController {
  private final SecurityEventRepository securityEventRepository;

  public SecurityEventController(SecurityEventRepository securityEventRepository) {
    this.securityEventRepository = securityEventRepository;
  }

  @GetMapping
  public List<SecurityEvent> getAllSecurityEvents() {
    return securityEventRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<SecurityEvent> getSecurityEventById(@PathVariable @NonNull Long id) {
    return securityEventRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<SecurityEvent> createSecurityEvent(@RequestBody SecurityEvent securityEvent) {
    securityEvent.setCreatedAt(LocalDateTime.now());
    if (securityEvent.getStatus() == null) {
      securityEvent.setStatus("PENDIENTE");
    }
    if (securityEvent.getEventDate() == null) {
      securityEvent.setEventDate(LocalDateTime.now());
    }
    if (securityEvent.getSeverity() == null) {
      securityEvent.setSeverity("MEDIA");
    }
    if (securityEvent.getPriority() == null) {
      securityEvent.setPriority("NORMAL");
    }
    SecurityEvent savedSecurityEvent = securityEventRepository.save(securityEvent);
    return ResponseEntity.ok(savedSecurityEvent);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateSecurityEvent(@PathVariable @NonNull Long id, @RequestBody SecurityEvent securityEvent) {
    return securityEventRepository.findById(id)
      .map(existingSecurityEvent -> {
        existingSecurityEvent.setTitle(securityEvent.getTitle());
        existingSecurityEvent.setDescription(securityEvent.getDescription());
        existingSecurityEvent.setType(securityEvent.getType());
        existingSecurityEvent.setSeverity(securityEvent.getSeverity());
        existingSecurityEvent.setLocation(securityEvent.getLocation());
        existingSecurityEvent.setZone(securityEvent.getZone());
        existingSecurityEvent.setStatus(securityEvent.getStatus());
        existingSecurityEvent.setReportedBy(securityEvent.getReportedBy());
        existingSecurityEvent.setAssignedTo(securityEvent.getAssignedTo());
        existingSecurityEvent.setEventDate(securityEvent.getEventDate());
        existingSecurityEvent.setResolution(securityEvent.getResolution());
        existingSecurityEvent.setActionTaken(securityEvent.getActionTaken());
        existingSecurityEvent.setWitnesses(securityEvent.getWitnesses());
        existingSecurityEvent.setInvolvedPersons(securityEvent.getInvolvedPersons());
        existingSecurityEvent.setEvidence(securityEvent.getEvidence());
        existingSecurityEvent.setPriority(securityEvent.getPriority());
        existingSecurityEvent.setCategory(securityEvent.getCategory());
        existingSecurityEvent.setResponseTime(securityEvent.getResponseTime());
        existingSecurityEvent.setFollowUpRequired(securityEvent.getFollowUpRequired());
        
        if ("RESUELTO".equals(securityEvent.getStatus()) && existingSecurityEvent.getResolvedDate() == null) {
          existingSecurityEvent.setResolvedDate(LocalDateTime.now());
        }
        
        SecurityEvent updatedSecurityEvent = securityEventRepository.save(existingSecurityEvent);
        return ResponseEntity.ok(updatedSecurityEvent);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteSecurityEvent(@PathVariable @NonNull Long id) {
    if (securityEventRepository.existsById(id)) {
      securityEventRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<SecurityEvent> getSecurityEventsByStatus(@PathVariable String status) {
    return securityEventRepository.findByStatus(status);
  }

  @GetMapping("/type/{type}")
  public List<SecurityEvent> getSecurityEventsByType(@PathVariable String type) {
    return securityEventRepository.findByType(type);
  }

  @GetMapping("/severity/{severity}")
  public List<SecurityEvent> getSecurityEventsBySeverity(@PathVariable String severity) {
    return securityEventRepository.findBySeverity(severity);
  }

  @GetMapping("/zone/{zone}")
  public List<SecurityEvent> getSecurityEventsByZone(@PathVariable String zone) {
    return securityEventRepository.findByZone(zone);
  }

  @GetMapping("/assigned/{assignedTo}")
  public List<SecurityEvent> getSecurityEventsByAssigned(@PathVariable String assignedTo) {
    return securityEventRepository.findByAssignedTo(assignedTo);
  }

  @GetMapping("/reported/{reportedBy}")
  public List<SecurityEvent> getSecurityEventsByReported(@PathVariable String reportedBy) {
    return securityEventRepository.findByReportedBy(reportedBy);
  }
}
