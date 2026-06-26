package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransparencyMetricsRepository extends JpaRepository<TransparencyMetrics, Long> {
  List<TransparencyMetrics> findByMetricCategory(String metricCategory);
  List<TransparencyMetrics> findByPeriod(String period);
  List<TransparencyMetrics> findByIsCompliant(Boolean isCompliant);
  List<TransparencyMetrics> findByRelatedArticle(String relatedArticle);
  List<TransparencyMetrics> findByStatus(String status);
}
