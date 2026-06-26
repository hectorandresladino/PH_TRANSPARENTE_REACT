package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
  private final ReservationRepository reservationRepository;

  public ReservationController(ReservationRepository reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  @GetMapping
  public List<Reservation> getAllReservations() {
    return reservationRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Reservation> getReservationById(@PathVariable @NonNull Long id) {
    return reservationRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
    reservation.setCreatedAt(LocalDateTime.now());
    if (reservation.getStatus() == null) {
      reservation.setStatus("CONFIRMADA");
    }
    Reservation savedReservation = reservationRepository.save(reservation);
    return ResponseEntity.ok(savedReservation);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateReservation(@PathVariable @NonNull Long id, @RequestBody Reservation reservation) {
    return reservationRepository.findById(id)
      .map(existingReservation -> {
        existingReservation.setFacility(reservation.getFacility());
        existingReservation.setUserId(reservation.getUserId());
        existingReservation.setUserName(reservation.getUserName());
        existingReservation.setStartTime(reservation.getStartTime());
        existingReservation.setEndTime(reservation.getEndTime());
        existingReservation.setAttendees(reservation.getAttendees());
        existingReservation.setStatus(reservation.getStatus());
        existingReservation.setNotes(reservation.getNotes());
        
        Reservation updatedReservation = reservationRepository.save(existingReservation);
        return ResponseEntity.ok(updatedReservation);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteReservation(@PathVariable @NonNull Long id) {
    if (reservationRepository.existsById(id)) {
      reservationRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/facility/{facility}")
  public List<Reservation> getReservationsByFacility(@PathVariable String facility) {
    return reservationRepository.findByFacility(facility);
  }

  @GetMapping("/user/{userId}")
  public List<Reservation> getReservationsByUser(@PathVariable String userId) {
    return reservationRepository.findByUserId(userId);
  }

  @GetMapping("/status/{status}")
  public List<Reservation> getReservationsByStatus(@PathVariable String status) {
    return reservationRepository.findByStatus(status);
  }

  @GetMapping("/upcoming")
  public List<Reservation> getUpcomingReservations() {
    return reservationRepository.findByStartTimeAfter(LocalDateTime.now());
  }
}
