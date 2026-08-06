package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnualBudgetRepository extends JpaRepository<AnnualBudget, Long> {
  boolean existsByIdAndOrganizationId(Long id, Long organizationId);
  List<AnnualBudget> findByOrganizationId(Long organizationId);
  List<AnnualBudget> findByOrganizationIdAndBudgetYear(Long organizationId, Integer budgetYear);
  List<AnnualBudget> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<AnnualBudget> findByOrganizationIdAndBudgetType(Long organizationId, String budgetType);
  AnnualBudget findByOrganizationIdAndBudgetYearAndBudgetType(Long organizationId, Integer budgetYear, String budgetType);
}
