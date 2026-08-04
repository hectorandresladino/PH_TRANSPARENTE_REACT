package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
  List<Report> findByOrganizationId(Long organizationId);
  List<Report> findByOrganizationIdAndModuleName(Long organizationId, String moduleName);
  List<Report> findByOrganizationIdAndReportType(Long organizationId, String reportType);
  List<Report> findByOrganizationIdAndGeneratedBy(Long organizationId, Long generatedBy);
  List<Report> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Report> findByOrganizationIdAndGenerationDateBetween(Long organizationId, LocalDate startDate, LocalDate endDate);
  List<Report> findByOrganizationIdAndModuleNameAndReportType(Long organizationId, String moduleName, String reportType);
}
