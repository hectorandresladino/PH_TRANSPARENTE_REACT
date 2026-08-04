package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/visitors")
public class VisitorController {
  private final VisitorRepository visitorRepository;

  public VisitorController(VisitorRepository visitorRepository) {
    this.visitorRepository = visitorRepository;
  }

  @GetMapping
  public List<Visitor> getAllVisitors() {
    return visitorRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Visitor> getVisitorById(@PathVariable @NonNull Long id) {
    return visitorRepository.findById(id)
      .filter(v -> v.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Visitor> createVisitor(@RequestBody Visitor visitor) {
    visitor.setOrganizationId(TenantContext.getOrganizationId());
    visitor.setCreatedAt(LocalDateTime.now());
    visitor.setEntryTime(LocalDateTime.now());
    if (visitor.getStatus() == null) {
      visitor.setStatus("ACTIVO");
    }
    Visitor savedVisitor = visitorRepository.save(visitor);
    return ResponseEntity.ok(savedVisitor);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateVisitor(@PathVariable @NonNull Long id, @RequestBody Visitor visitor) {
    Long orgId = TenantContext.getOrganizationId();
    return visitorRepository.findById(id)
      .filter(existingVisitor -> existingVisitor.getOrganizationId().equals(orgId))
      .map(existingVisitor -> {
        existingVisitor.setName(visitor.getName());
        existingVisitor.setDocumentNumber(visitor.getDocumentNumber());
        existingVisitor.setDocumentType(visitor.getDocumentType());
        existingVisitor.setPhone(visitor.getPhone());
        existingVisitor.setHostUserId(visitor.getHostUserId());
        existingVisitor.setHostName(visitor.getHostName());
        existingVisitor.setHostUnit(visitor.getHostUnit());
        existingVisitor.setVisitType(visitor.getVisitType());
        existingVisitor.setPurpose(visitor.getPurpose());
        existingVisitor.setEntryTime(visitor.getEntryTime());
        existingVisitor.setExitTime(visitor.getExitTime());
        existingVisitor.setStatus(visitor.getStatus());
        existingVisitor.setVehiclePlate(visitor.getVehiclePlate());
        existingVisitor.setNotes(visitor.getNotes());
        
        if ("SALIDA".equals(visitor.getStatus()) && existingVisitor.getExitTime() == null) {
          existingVisitor.setExitTime(LocalDateTime.now());
        }
        
        Visitor updatedVisitor = visitorRepository.save(existingVisitor);
        return ResponseEntity.ok(updatedVisitor);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteVisitor(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    return visitorRepository.findById(id)
      .filter(v -> v.getOrganizationId().equals(orgId))
      .map(v -> {
        visitorRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/status/{status}")
  public List<Visitor> getVisitorsByStatus(@PathVariable String status) {
    return visitorRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/type/{visitType}")
  public List<Visitor> getVisitorsByType(@PathVariable String visitType) {
    return visitorRepository.findByOrganizationIdAndVisitType(TenantContext.getOrganizationId(), visitType);
  }

  @GetMapping("/unit/{hostUnit}")
  public List<Visitor> getVisitorsByUnit(@PathVariable String hostUnit) {
    return visitorRepository.findByOrganizationIdAndHostUnit(TenantContext.getOrganizationId(), hostUnit);
  }

  @GetMapping("/active")
  public List<Visitor> getActiveVisitors() {
    return visitorRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), "ACTIVO");
  }
}
