package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String facility;

  @Column(nullable = false)
  private String userId;

  private String userName;

  @Column(nullable = false)
  private LocalDateTime startTime;

  @Column(nullable = false)
  private LocalDateTime endTime;

  private Integer attendees;

  private String status;

  private String notes;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  public Reservation() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getFacility() { return facility; }
  public void setFacility(String facility) { this.facility = facility; }

  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }

  public String getUserName() { return userName; }
  public void setUserName(String userName) { this.userName = userName; }

  public LocalDateTime getStartTime() { return startTime; }
  public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

  public LocalDateTime getEndTime() { return endTime; }
  public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

  public Integer getAttendees() { return attendees; }
  public void setAttendees(Integer attendees) { this.attendees = attendees; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
