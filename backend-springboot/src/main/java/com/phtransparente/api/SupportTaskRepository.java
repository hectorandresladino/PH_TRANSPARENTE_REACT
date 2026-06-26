package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTaskRepository extends JpaRepository<SupportTask, Long> {
  List<SupportTask> findByStatus(String status);
  List<SupportTask> findByCategory(String category);
  List<SupportTask> findByPriority(String priority);
  List<SupportTask> findByAssignedTo(String assignedTo);
  List<SupportTask> findByCreatedBy(String createdBy);
  List<SupportTask> findByPropertyUnit(String propertyUnit);
  List<SupportTask> findByDueDateBefore(LocalDate date);
  List<SupportTask> findByDueDateBetween(LocalDate startDate, LocalDate endDate);
}
