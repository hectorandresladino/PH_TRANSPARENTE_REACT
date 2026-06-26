package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/personnel-ratings")
public class PersonnelRatingController {
  private final PersonnelRatingRepository personnelRatingRepository;

  public PersonnelRatingController(PersonnelRatingRepository personnelRatingRepository) {
    this.personnelRatingRepository = personnelRatingRepository;
  }

  @GetMapping
  public List<PersonnelRating> getAllRatings() {
    return personnelRatingRepository.findAll();
  }

  @GetMapping("/person/{personId}")
  public List<PersonnelRating> getRatingsByPerson(@PathVariable Long personId) {
    return personnelRatingRepository.findByRatedPersonId(personId);
  }

  @GetMapping("/role/{role}")
  public List<PersonnelRating> getRatingsByRole(@PathVariable String role) {
    return personnelRatingRepository.findByRatedPersonRole(role);
  }

  @GetMapping("/type/{type}")
  public List<PersonnelRating> getRatingsByType(@PathVariable String type) {
    return personnelRatingRepository.findByRatedPersonType(type);
  }

  @GetMapping("/rater/{raterId}")
  public List<PersonnelRating> getRatingsByRater(@PathVariable Long raterId) {
    return personnelRatingRepository.findByRaterId(raterId);
  }

  @GetMapping("/property-unit/{unitId}")
  public List<PersonnelRating> getRatingsByPropertyUnit(@PathVariable Long unitId) {
    return personnelRatingRepository.findByPropertyUnitId(unitId);
  }

  @GetMapping("/period/{period}")
  public List<PersonnelRating> getRatingsByPeriod(@PathVariable String period) {
    return personnelRatingRepository.findByRatingPeriod(period);
  }

  @GetMapping("/category/{category}")
  public List<PersonnelRating> getRatingsByCategory(@PathVariable String category) {
    return personnelRatingRepository.findByRatingCategory(category);
  }

  @GetMapping("/status/{status}")
  public List<PersonnelRating> getRatingsByStatus(@PathVariable String status) {
    return personnelRatingRepository.findByStatus(status);
  }

  @GetMapping("/date-range")
  public List<PersonnelRating> getRatingsByDateRange(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
    return personnelRatingRepository.findByRatingDateBetween(startDate, endDate);
  }

  @GetMapping("/{id}")
  public ResponseEntity<PersonnelRating> getRatingById(@PathVariable @NonNull Long id) {
    return personnelRatingRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<PersonnelRating> createRating(@RequestBody PersonnelRating rating) {
    rating.setCreatedAt(LocalDate.now());
    rating.setUpdatedAt(LocalDate.now());
    rating.setRatingDate(LocalDate.now());
    if (rating.getStatus() == null) {
      rating.setStatus("APROBADO");
    }
    if (rating.getIsAnonymous() == null) {
      rating.setIsAnonymous(false);
    }
    if (rating.getIsVerified() == null) {
      rating.setIsVerified(false);
    }
    PersonnelRating savedRating = personnelRatingRepository.save(rating);
    return ResponseEntity.ok(savedRating);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateRating(@PathVariable @NonNull Long id, @RequestBody PersonnelRating rating) {
    return personnelRatingRepository.findById(id)
      .map(existingRating -> {
        existingRating.setRatedPersonName(rating.getRatedPersonName());
        existingRating.setRatedPersonRole(rating.getRatedPersonRole());
        existingRating.setRatedPersonType(rating.getRatedPersonType());
        existingRating.setOverallRating(rating.getOverallRating());
        existingRating.setProfessionalismRating(rating.getProfessionalismRating());
        existingRating.setResponsivenessRating(rating.getResponsivenessRating());
        existingRating.setQualityRating(rating.getQualityRating());
        existingRating.setCommunicationRating(rating.getCommunicationRating());
        existingRating.setReliabilityRating(rating.getReliabilityRating());
        existingRating.setComments(rating.getComments());
        existingRating.setPositiveAspects(rating.getPositiveAspects());
        existingRating.setImprovementAreas(rating.getImprovementAreas());
        existingRating.setRatingPeriod(rating.getRatingPeriod());
        existingRating.setRatingCategory(rating.getRatingCategory());
        existingRating.setIsAnonymous(rating.getIsAnonymous());
        existingRating.setIsVerified(rating.getIsVerified());
        existingRating.setStatus(rating.getStatus());
        existingRating.setUpdatedAt(LocalDate.now());
        
        PersonnelRating updatedRating = personnelRatingRepository.save(existingRating);
        return ResponseEntity.ok(updatedRating);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteRating(@PathVariable @NonNull Long id) {
    if (personnelRatingRepository.existsById(id)) {
      personnelRatingRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }
}
