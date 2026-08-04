package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetProposalRepository extends JpaRepository<BudgetProposal, Long> {
  List<BudgetProposal> findByOrganizationId(Long organizationId);
  List<BudgetProposal> findByOrganizationIdAndBudgetId(Long organizationId, Long budgetId);
  List<BudgetProposal> findByOrganizationIdAndBudgetIdAndStatus(Long organizationId, Long budgetId, String status);
  List<BudgetProposal> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<BudgetProposal> findByBudgetId(Long budgetId);
  List<BudgetProposal> findByBudgetIdAndStatus(Long budgetId, String status);
  List<BudgetProposal> findByStatus(String status);
}
