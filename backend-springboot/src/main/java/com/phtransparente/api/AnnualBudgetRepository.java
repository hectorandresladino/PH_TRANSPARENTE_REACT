package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnualBudgetRepository extends JpaRepository<AnnualBudget, Long> {
  List<AnnualBudget> findByBudgetYear(Integer budgetYear);
  List<AnnualBudget> findByStatus(String status);
  List<AnnualBudget> findByBudgetType(String budgetType);
  AnnualBudget findByBudgetYearAndBudgetType(Integer budgetYear, String budgetType);
}
