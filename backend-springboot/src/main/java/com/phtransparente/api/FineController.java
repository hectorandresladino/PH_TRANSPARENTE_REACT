package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fines")
public class FineController {
  private final FineRepository fineRepository;

  public FineController(FineRepository fineRepository) {
    this.fineRepository = fineRepository;
  }

  @GetMapping
  public List<Fine> getAllFines() {
    return fineRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Fine> getFineById(@PathVariable @NonNull Long id) {
    return fineRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Fine> createFine(@RequestBody Fine fine) {
    fine.setCreatedAt(LocalDate.now());
    if (fine.getStatus() == null) {
      fine.setStatus("PENDIENTE");
    }
    if (fine.getCurrency() == null) {
      fine.setCurrency("COP");
    }
    Fine savedFine = fineRepository.save(fine);
    return ResponseEntity.ok(savedFine);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateFine(@PathVariable @NonNull Long id, @RequestBody Fine fine) {
    return fineRepository.findById(id)
      .map(existingFine -> {
        existingFine.setFineNumber(fine.getFineNumber());
        existingFine.setType(fine.getType());
        existingFine.setDescription(fine.getDescription());
        existingFine.setAmount(fine.getAmount());
        existingFine.setCurrency(fine.getCurrency());
        existingFine.setUserId(fine.getUserId());
        existingFine.setUserName(fine.getUserName());
        existingFine.setUnit(fine.getUnit());
        existingFine.setStatus(fine.getStatus());
        existingFine.setDueDate(fine.getDueDate());
        
        if ("PAGADA".equals(fine.getStatus()) && existingFine.getPaymentDate() == null) {
          existingFine.setPaymentDate(LocalDate.now());
        }
        
        Fine updatedFine = fineRepository.save(existingFine);
        return ResponseEntity.ok(updatedFine);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteFine(@PathVariable @NonNull Long id) {
    if (fineRepository.existsById(id)) {
      fineRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Fine> getFinesByStatus(@PathVariable String status) {
    return fineRepository.findByStatus(status);
  }

  @GetMapping("/user/{userId}")
  public List<Fine> getFinesByUser(@PathVariable String userId) {
    return fineRepository.findByUserId(userId);
  }

  @GetMapping("/unit/{unit}")
  public List<Fine> getFinesByUnit(@PathVariable String unit) {
    return fineRepository.findByUnit(unit);
  }

  @GetMapping("/type/{type}")
  public List<Fine> getFinesByType(@PathVariable String type) {
    return fineRepository.findByType(type);
  }
}
