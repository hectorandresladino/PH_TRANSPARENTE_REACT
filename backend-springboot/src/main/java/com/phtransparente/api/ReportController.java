package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
  private final ReportRepository reportRepository;

  public ReportController(ReportRepository reportRepository) {
    this.reportRepository = reportRepository;
  }

  @GetMapping
  public List<Report> getAllReports() {
    return reportRepository.findAll();
  }

  @GetMapping("/module/{moduleName}")
  public List<Report> getReportsByModule(@PathVariable String moduleName) {
    return reportRepository.findByModuleName(moduleName);
  }

  @GetMapping("/type/{reportType}")
  public List<Report> getReportsByType(@PathVariable String reportType) {
    return reportRepository.findByReportType(reportType);
  }

  @GetMapping("/user/{userId}")
  public List<Report> getReportsByUser(@PathVariable Long userId) {
    return reportRepository.findByGeneratedBy(userId);
  }

  @GetMapping("/status/{status}")
  public List<Report> getReportsByStatus(@PathVariable String status) {
    return reportRepository.findByStatus(status);
  }

  @GetMapping("/date-range")
  public List<Report> getReportsByDateRange(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
    return reportRepository.findByGenerationDateBetween(startDate, endDate);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Report> getReportById(@PathVariable @NonNull Long id) {
    return reportRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Report> createReport(@RequestBody Report report) {
    report.setCreatedAt(LocalDate.now());
    report.setUpdatedAt(LocalDate.now());
    report.setGenerationDate(LocalDate.now());
    if (report.getStatus() == null) {
      report.setStatus("GENERADO");
    }
    if (report.getReportFormat() == null) {
      report.setReportFormat("PDF");
    }
    Report savedReport = reportRepository.save(report);
    return ResponseEntity.ok(savedReport);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateReport(@PathVariable @NonNull Long id, @RequestBody Report report) {
    return reportRepository.findById(id)
      .map(existingReport -> {
        existingReport.setReportName(report.getReportName());
        existingReport.setReportType(report.getReportType());
        existingReport.setModuleName(report.getModuleName());
        existingReport.setReportFormat(report.getReportFormat());
        existingReport.setPeriodStart(report.getPeriodStart());
        existingReport.setPeriodEnd(report.getPeriodEnd());
        existingReport.setReportData(report.getReportData());
        existingReport.setFilePath(report.getFilePath());
        existingReport.setFileSize(report.getFileSize());
        existingReport.setStatus(report.getStatus());
        existingReport.setReportDescription(report.getReportDescription());
        existingReport.setFiltersApplied(report.getFiltersApplied());
        existingReport.setRecordCount(report.getRecordCount());
        existingReport.setUpdatedAt(LocalDate.now());
        
        Report updatedReport = reportRepository.save(existingReport);
        return ResponseEntity.ok(updatedReport);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteReport(@PathVariable @NonNull Long id) {
    if (reportRepository.existsById(id)) {
      reportRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }
}
