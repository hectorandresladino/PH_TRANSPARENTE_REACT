package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
  List<Document> findByOrganizationId(Long organizationId);
  List<Document> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Document> findByOrganizationIdAndType(Long organizationId, String type);
  List<Document> findByOrganizationIdAndCategory(Long organizationId, String category);
  List<Document> findByOrganizationIdAndUploadedBy(Long organizationId, String uploadedBy);
}
