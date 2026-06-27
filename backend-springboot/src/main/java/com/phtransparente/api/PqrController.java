package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pqrs")
public class PqrController {
  private final PqrRepository pqrRepository;

  public PqrController(PqrRepository pqrRepository) {
    this.pqrRepository = pqrRepository;
  }

  @GetMapping
  public List<Pqr> getAllPqrs() {
    return pqrRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Pqr> getPqrById(@PathVariable @NonNull Long id) {
    return pqrRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Pqr> createPqr(@RequestBody Pqr pqr) {
    pqr.setCreatedAt(LocalDateTime.now());
    pqr.setUpdatedAt(LocalDateTime.now());
    if (pqr.getStatus() == null) {
      pqr.setStatus("PENDIENTE");
    }
    Pqr savedPqr = pqrRepository.save(pqr);
    return ResponseEntity.ok(savedPqr);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updatePqr(@PathVariable @NonNull Long id, @RequestBody Pqr pqr) {
    return pqrRepository.findById(id)
      .map(existingPqr -> {
        existingPqr.setType(pqr.getType());
        existingPqr.setTitle(pqr.getTitle());
        existingPqr.setDescription(pqr.getDescription());
        existingPqr.setRequester(pqr.getRequester());
        existingPqr.setEmail(pqr.getEmail());
        existingPqr.setPhone(pqr.getPhone());
        existingPqr.setStatus(pqr.getStatus());
        existingPqr.setPriority(pqr.getPriority());
        existingPqr.setResponse(pqr.getResponse());
        if (pqr.getAttachmentName() != null) {
          existingPqr.setAttachmentName(pqr.getAttachmentName());
          existingPqr.setAttachmentType(pqr.getAttachmentType());
          existingPqr.setAttachmentData(pqr.getAttachmentData());
        }
        existingPqr.setUpdatedAt(LocalDateTime.now());
        
        if ("RESUELTA".equals(pqr.getStatus()) && existingPqr.getResolvedAt() == null) {
          existingPqr.setResolvedAt(LocalDateTime.now());
        }
        
        Pqr updatedPqr = pqrRepository.save(existingPqr);
        return ResponseEntity.ok(updatedPqr);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deletePqr(@PathVariable @NonNull Long id) {
    if (pqrRepository.existsById(id)) {
      pqrRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Pqr> getPqrsByStatus(@PathVariable String status) {
    return pqrRepository.findByStatus(status);
  }

  @GetMapping("/type/{type}")
  public List<Pqr> getPqrsByType(@PathVariable String type) {
    return pqrRepository.findByType(type);
  }

  @GetMapping("/priority/{priority}")
  public List<Pqr> getPqrsByPriority(@PathVariable String priority) {
    return pqrRepository.findByPriority(priority);
  }
}
