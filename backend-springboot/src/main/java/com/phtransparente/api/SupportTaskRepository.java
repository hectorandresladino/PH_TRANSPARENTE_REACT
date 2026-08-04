package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTaskRepository extends JpaRepository<SupportTask, Long> {
  List<SupportTask> findByOrganizationId(Long organizationId);
  List<SupportTask> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<SupportTask> findByOrganizationIdAndCategory(Long organizationId, String category);
  List<SupportTask> findByOrganizationIdAndPriority(Long organizationId, String priority);
  List<SupportTask> findByOrganizationIdAndAssignedTo(Long organizationId, String assignedTo);
  List<SupportTask> findByOrganizationIdAndCreatedBy(Long organizationId, String createdBy);
  List<SupportTask> findByOrganizationIdAndPropertyUnit(Long organizationId, String propertyUnit);
  List<SupportTask> findByOrganizationIdAndDueDateBefore(Long organizationId, LocalDate date);
  List<SupportTask> findByOrganizationIdAndDueDateBetween(Long organizationId, LocalDate startDate, LocalDate endDate);
}
