package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouncilRepository extends JpaRepository<Council, Long> {
  List<Council> findByStatus(String status);
  List<Council> findByRole(String role);
  List<Council> findByMemberId(String memberId);
}
