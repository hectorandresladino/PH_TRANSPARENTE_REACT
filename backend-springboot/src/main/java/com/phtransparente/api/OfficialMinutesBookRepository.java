package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfficialMinutesBookRepository extends JpaRepository<OfficialMinutesBook, Long> {
  List<OfficialMinutesBook> findByOrganizationId(Long organizationId);
  List<OfficialMinutesBook> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<OfficialMinutesBook> findByOrganizationIdAndAssemblyType(Long organizationId, String assemblyType);
  List<OfficialMinutesBook> findByOrganizationIdAndMeetingDateBetween(Long organizationId, LocalDate startDate, LocalDate endDate);
  OfficialMinutesBook findByOrganizationIdAndMinuteNumber(Long organizationId, String minuteNumber);
}
