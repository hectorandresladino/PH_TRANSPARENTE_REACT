package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfficialMinutesBookRepository extends JpaRepository<OfficialMinutesBook, Long> {
  List<OfficialMinutesBook> findByStatus(String status);
  List<OfficialMinutesBook> findByAssemblyType(String assemblyType);
  List<OfficialMinutesBook> findByMeetingDateBetween(LocalDate startDate, LocalDate endDate);
  OfficialMinutesBook findByMinuteNumber(String minuteNumber);
}
