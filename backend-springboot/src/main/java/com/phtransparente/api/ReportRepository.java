package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
  List<Report> findByModuleName(String moduleName);
  List<Report> findByReportType(String reportType);
  List<Report> findByGeneratedBy(Long generatedBy);
  List<Report> findByStatus(String status);
  List<Report> findByGenerationDateBetween(LocalDate startDate, LocalDate endDate);
  List<Report> findByModuleNameAndReportType(String moduleName, String reportType);
}
