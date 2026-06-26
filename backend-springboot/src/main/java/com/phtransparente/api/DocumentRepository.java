package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
  List<Document> findByStatus(String status);
  List<Document> findByType(String type);
  List<Document> findByCategory(String category);
  List<Document> findByUploadedBy(String uploadedBy);
}
