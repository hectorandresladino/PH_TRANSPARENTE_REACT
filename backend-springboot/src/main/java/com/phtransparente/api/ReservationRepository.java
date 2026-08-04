package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
  List<Reservation> findByOrganizationId(Long organizationId);
  List<Reservation> findByOrganizationIdAndFacility(Long organizationId, String facility);
  List<Reservation> findByOrganizationIdAndUserId(Long organizationId, String userId);
  List<Reservation> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Reservation> findByOrganizationIdAndStartTimeAfter(Long organizationId, LocalDateTime startTime);
  List<Reservation> findByOrganizationIdAndStartTimeBetween(Long organizationId, LocalDateTime start, LocalDateTime end);
}
