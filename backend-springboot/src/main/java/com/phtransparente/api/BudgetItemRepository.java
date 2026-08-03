package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetItemRepository extends JpaRepository<BudgetItem, Long> {
  List<BudgetItem> findByBudgetId(Long budgetId);
  void deleteByBudgetId(Long budgetId);
}
