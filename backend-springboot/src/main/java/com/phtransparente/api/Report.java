package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reports")
public class Report {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "report_name", nullable = false)
  private String reportName;

  @Column(name = "report_type", nullable = false)
  private String reportType;

  @Column(name = "module_name", nullable = false)
  private String moduleName;

  @Column(name = "report_format")
  private String reportFormat;

  @Column(name = "generated_by")
  private Long generatedBy;

  @Column(name = "generation_date")
  private LocalDate generationDate;

  @Column(name = "period_start")
  private LocalDate periodStart;

  @Column(name = "period_end")
  private LocalDate periodEnd;

  @Column(name = "report_data")
  private String reportData;

  @Column(name = "file_path")
  private String filePath;

  @Column(name = "file_size")
  private Long fileSize;

  @Column(name = "status")
  private String status;

  @Column(name = "report_description")
  private String reportDescription;

  @Column(name = "filters_applied")
  private String filtersApplied;

  @Column(name = "record_count")
  private Integer recordCount;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  public Report() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getReportName() { return reportName; }
  public void setReportName(String reportName) { this.reportName = reportName; }

  public String getReportType() { return reportType; }
  public void setReportType(String reportType) { this.reportType = reportType; }

  public String getModuleName() { return moduleName; }
  public void setModuleName(String moduleName) { this.moduleName = moduleName; }

  public String getReportFormat() { return reportFormat; }
  public void setReportFormat(String reportFormat) { this.reportFormat = reportFormat; }

  public Long getGeneratedBy() { return generatedBy; }
  public void setGeneratedBy(Long generatedBy) { this.generatedBy = generatedBy; }

  public LocalDate getGenerationDate() { return generationDate; }
  public void setGenerationDate(LocalDate generationDate) { this.generationDate = generationDate; }

  public LocalDate getPeriodStart() { return periodStart; }
  public void setPeriodStart(LocalDate periodStart) { this.periodStart = periodStart; }

  public LocalDate getPeriodEnd() { return periodEnd; }
  public void setPeriodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; }

  public String getReportData() { return reportData; }
  public void setReportData(String reportData) { this.reportData = reportData; }

  public String getFilePath() { return filePath; }
  public void setFilePath(String filePath) { this.filePath = filePath; }

  public Long getFileSize() { return fileSize; }
  public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getReportDescription() { return reportDescription; }
  public void setReportDescription(String reportDescription) { this.reportDescription = reportDescription; }

  public String getFiltersApplied() { return filtersApplied; }
  public void setFiltersApplied(String filtersApplied) { this.filtersApplied = filtersApplied; }

  public Integer getRecordCount() { return recordCount; }
  public void setRecordCount(Integer recordCount) { this.recordCount = recordCount; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }
}
