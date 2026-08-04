package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransparencyMetricsRepository extends JpaRepository<TransparencyMetrics, Long> {
  List<TransparencyMetrics> findByOrganizationId(Long organizationId);
  List<TransparencyMetrics> findByOrganizationIdAndMetricCategory(Long organizationId, String metricCategory);
  List<TransparencyMetrics> findByOrganizationIdAndPeriod(Long organizationId, String period);
  List<TransparencyMetrics> findByOrganizationIdAndIsCompliant(Long organizationId, Boolean isCompliant);
  List<TransparencyMetrics> findByOrganizationIdAndRelatedArticle(Long organizationId, String relatedArticle);
  List<TransparencyMetrics> findByOrganizationIdAndStatus(Long organizationId, String status);
}
