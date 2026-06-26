package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
  List<Reservation> findByFacility(String facility);
  List<Reservation> findByUserId(String userId);
  List<Reservation> findByStatus(String status);
  List<Reservation> findByStartTimeAfter(LocalDateTime startTime);
  List<Reservation> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
