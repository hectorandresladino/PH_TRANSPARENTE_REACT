package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "documents")
public class Document {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String description;

  @Column(nullable = false)
  private String type;

  private String category;

  private String fileName;

  private String filePath;

  private Long fileSize;

  private String mimeType;

  @Column(nullable = false)
  private String uploadedBy;

  private String uploadedByName;

  @Column(nullable = false)
  private String status;

  @Column(name = "upload_date")
  private LocalDate uploadDate;

  @Column(name = "expiry_date")
  private LocalDate expiryDate;

  @Column(name = "created_at")
  private LocalDate createdAt;

  public Document() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public String getFileName() { return fileName; }
  public void setFileName(String fileName) { this.fileName = fileName; }

  public String getFilePath() { return filePath; }
  public void setFilePath(String filePath) { this.filePath = filePath; }

  public Long getFileSize() { return fileSize; }
  public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

  public String getMimeType() { return mimeType; }
  public void setMimeType(String mimeType) { this.mimeType = mimeType; }

  public String getUploadedBy() { return uploadedBy; }
  public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

  public String getUploadedByName() { return uploadedByName; }
  public void setUploadedByName(String uploadedByName) { this.uploadedByName = uploadedByName; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public LocalDate getUploadDate() { return uploadDate; }
  public void setUploadDate(LocalDate uploadDate) { this.uploadDate = uploadDate; }

  public LocalDate getExpiryDate() { return expiryDate; }
  public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
