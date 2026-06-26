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
    return visitorRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Visitor> getVisitorById(@PathVariable @NonNull Long id) {
    return visitorRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Visitor> createVisitor(@RequestBody Visitor visitor) {
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
    return visitorRepository.findById(id)
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
    if (visitorRepository.existsById(id)) {
      visitorRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Visitor> getVisitorsByStatus(@PathVariable String status) {
    return visitorRepository.findByStatus(status);
  }

  @GetMapping("/type/{visitType}")
  public List<Visitor> getVisitorsByType(@PathVariable String visitType) {
    return visitorRepository.findByVisitType(visitType);
  }

  @GetMapping("/unit/{hostUnit}")
  public List<Visitor> getVisitorsByUnit(@PathVariable String hostUnit) {
    return visitorRepository.findByHostUnit(hostUnit);
  }

  @GetMapping("/active")
  public List<Visitor> getActiveVisitors() {
    return visitorRepository.findByStatus("ACTIVO");
  }
}
