package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
  List<Vote> findByStatus(String status);
  List<Vote> findByType(String type);
  List<Vote> findByAssemblyId(Long assemblyId);
  List<Vote> findByCreatedBy(String createdBy);
}
