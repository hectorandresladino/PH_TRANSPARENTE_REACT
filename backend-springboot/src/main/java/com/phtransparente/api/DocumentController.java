package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
  private final DocumentRepository documentRepository;

  public DocumentController(DocumentRepository documentRepository) {
    this.documentRepository = documentRepository;
  }

  @GetMapping
  public List<Document> getAllDocuments() {
    return documentRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Document> getDocumentById(@PathVariable @NonNull Long id) {
    return documentRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Document> createDocument(@RequestBody Document document) {
    document.setCreatedAt(LocalDate.now());
    document.setUploadDate(LocalDate.now());
    if (document.getStatus() == null) {
      document.setStatus("ACTIVO");
    }
    Document savedDocument = documentRepository.save(document);
    return ResponseEntity.ok(savedDocument);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateDocument(@PathVariable @NonNull Long id, @RequestBody Document document) {
    return documentRepository.findById(id)
      .map(existingDocument -> {
        existingDocument.setTitle(document.getTitle());
        existingDocument.setDescription(document.getDescription());
        existingDocument.setType(document.getType());
        existingDocument.setCategory(document.getCategory());
        existingDocument.setFileName(document.getFileName());
        existingDocument.setFilePath(document.getFilePath());
        existingDocument.setFileSize(document.getFileSize());
        existingDocument.setMimeType(document.getMimeType());
        existingDocument.setUploadedBy(document.getUploadedBy());
        existingDocument.setUploadedByName(document.getUploadedByName());
        existingDocument.setStatus(document.getStatus());
        existingDocument.setExpiryDate(document.getExpiryDate());
        
        Document updatedDocument = documentRepository.save(existingDocument);
        return ResponseEntity.ok(updatedDocument);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteDocument(@PathVariable @NonNull Long id) {
    if (documentRepository.existsById(id)) {
      documentRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Document> getDocumentsByStatus(@PathVariable String status) {
    return documentRepository.findByStatus(status);
  }

  @GetMapping("/type/{type}")
  public List<Document> getDocumentsByType(@PathVariable String type) {
    return documentRepository.findByType(type);
  }

  @GetMapping("/category/{category}")
  public List<Document> getDocumentsByCategory(@PathVariable String category) {
    return documentRepository.findByCategory(category);
  }

  @GetMapping("/uploader/{uploadedBy}")
  public List<Document> getDocumentsByUploader(@PathVariable String uploadedBy) {
    return documentRepository.findByUploadedBy(uploadedBy);
  }
}
