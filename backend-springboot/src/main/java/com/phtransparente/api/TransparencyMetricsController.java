package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transparency-metrics")
public class TransparencyMetricsController {
  private final TransparencyMetricsRepository transparencyMetricsRepository;

  public TransparencyMetricsController(TransparencyMetricsRepository transparencyMetricsRepository) {
    this.transparencyMetricsRepository = transparencyMetricsRepository;
  }

  @GetMapping
  public List<TransparencyMetrics> getAllTransparencyMetrics() {
    return transparencyMetricsRepository.findAll();
  }

  @GetMapping("/category/{category}")
  public List<TransparencyMetrics> getMetricsByCategory(@PathVariable String category) {
    return transparencyMetricsRepository.findByMetricCategory(category);
  }

  @GetMapping("/period/{period}")
  public List<TransparencyMetrics> getMetricsByPeriod(@PathVariable String period) {
    return transparencyMetricsRepository.findByPeriod(period);
  }

  @GetMapping("/compliance/{isCompliant}")
  public List<TransparencyMetrics> getMetricsByCompliance(@PathVariable Boolean isCompliant) {
    return transparencyMetricsRepository.findByIsCompliant(isCompliant);
  }

  @GetMapping("/article/{article}")
  public List<TransparencyMetrics> getMetricsByArticle(@PathVariable String article) {
    return transparencyMetricsRepository.findByRelatedArticle(article);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TransparencyMetrics> getTransparencyMetricById(@PathVariable @NonNull Long id) {
    return transparencyMetricsRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<TransparencyMetrics> createTransparencyMetric(@RequestBody TransparencyMetrics transparencyMetric) {
    transparencyMetric.setCreatedAt(LocalDate.now());
    transparencyMetric.setUpdatedAt(LocalDate.now());
    if (transparencyMetric.getMetricDate() == null) {
      transparencyMetric.setMetricDate(LocalDate.now());
    }
    TransparencyMetrics savedTransparencyMetric = transparencyMetricsRepository.save(transparencyMetric);
    return ResponseEntity.ok(savedTransparencyMetric);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateTransparencyMetric(@PathVariable @NonNull Long id, @RequestBody TransparencyMetrics transparencyMetric) {
    return transparencyMetricsRepository.findById(id)
      .map(existingTransparencyMetric -> {
        existingTransparencyMetric.setMetricName(transparencyMetric.getMetricName());
        existingTransparencyMetric.setMetricCategory(transparencyMetric.getMetricCategory());
        existingTransparencyMetric.setMetricValue(transparencyMetric.getMetricValue());
        existingTransparencyMetric.setMetricPercentage(transparencyMetric.getMetricPercentage());
        existingTransparencyMetric.setTargetValue(transparencyMetric.getTargetValue());
        existingTransparencyMetric.setTargetPercentage(transparencyMetric.getTargetPercentage());
        existingTransparencyMetric.setStatus(transparencyMetric.getStatus());
        existingTransparencyMetric.setPeriod(transparencyMetric.getPeriod());
        existingTransparencyMetric.setMetricDate(transparencyMetric.getMetricDate());
        existingTransparencyMetric.setRelatedArticle(transparencyMetric.getRelatedArticle());
        existingTransparencyMetric.setDescription(transparencyMetric.getDescription());
        existingTransparencyMetric.setIsCompliant(transparencyMetric.getIsCompliant());
        existingTransparencyMetric.setComplianceNotes(transparencyMetric.getComplianceNotes());
        existingTransparencyMetric.setUpdatedAt(LocalDate.now());
        
        TransparencyMetrics updatedTransparencyMetric = transparencyMetricsRepository.save(existingTransparencyMetric);
        return ResponseEntity.ok(updatedTransparencyMetric);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteTransparencyMetric(@PathVariable @NonNull Long id) {
    if (transparencyMetricsRepository.existsById(id)) {
      transparencyMetricsRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }
}
