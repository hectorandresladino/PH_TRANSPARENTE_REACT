package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/councils")
public class CouncilController {
  private final CouncilRepository councilRepository;

  public CouncilController(CouncilRepository councilRepository) {
    this.councilRepository = councilRepository;
  }

  @GetMapping
  public List<Council> getAllCouncils() {
    return councilRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Council> getCouncilById(@PathVariable @NonNull Long id) {
    return councilRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Council> createCouncil(@RequestBody Council council) {
    council.setCreatedAt(LocalDate.now());
    if (council.getStatus() == null) {
      council.setStatus("ACTIVO");
    }
    Council savedCouncil = councilRepository.save(council);
    return ResponseEntity.ok(savedCouncil);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateCouncil(@PathVariable @NonNull Long id, @RequestBody Council council) {
    return councilRepository.findById(id)
      .map(existingCouncil -> {
        existingCouncil.setName(council.getName());
        existingCouncil.setDescription(council.getDescription());
        existingCouncil.setRole(council.getRole());
        existingCouncil.setMemberId(council.getMemberId());
        existingCouncil.setMemberName(council.getMemberName());
        existingCouncil.setStartDate(council.getStartDate());
        existingCouncil.setEndDate(council.getEndDate());
        existingCouncil.setStatus(council.getStatus());
        existingCouncil.setContactEmail(council.getContactEmail());
        existingCouncil.setContactPhone(council.getContactPhone());
        
        Council updatedCouncil = councilRepository.save(existingCouncil);
        return ResponseEntity.ok(updatedCouncil);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteCouncil(@PathVariable @NonNull Long id) {
    if (councilRepository.existsById(id)) {
      councilRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Council> getCouncilsByStatus(@PathVariable String status) {
    return councilRepository.findByStatus(status);
  }

  @GetMapping("/role/{role}")
  public List<Council> getCouncilsByRole(@PathVariable String role) {
    return councilRepository.findByRole(role);
  }

  @GetMapping("/member/{memberId}")
  public List<Council> getCouncilsByMember(@PathVariable String memberId) {
    return councilRepository.findByMemberId(memberId);
  }
}
