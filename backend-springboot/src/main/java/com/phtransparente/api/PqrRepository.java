package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PqrRepository extends JpaRepository<Pqr, Long> {
  List<Pqr> findByStatus(String status);
  List<Pqr> findByType(String type);
  List<Pqr> findByPriority(String priority);
  List<Pqr> findByRequester(String requester);
}
