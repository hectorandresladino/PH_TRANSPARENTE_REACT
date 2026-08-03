package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetInquiryRepository extends JpaRepository<BudgetInquiry, Long> {
  List<BudgetInquiry> findByBudgetId(Long budgetId);
  List<BudgetInquiry> findByBudgetIdAndStatus(Long budgetId, String status);
  List<BudgetInquiry> findByStatus(String status);
}
