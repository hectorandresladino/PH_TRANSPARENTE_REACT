package com.phtransparente.api;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "support_tasks")
public class SupportTask {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(nullable = false)
  private String category; // MANTENIMIENTO, SEGURIDAD, LIMPIEZA, ADMINISTRACION, OTRO

  @Column(nullable = false)
  private String priority; // ALTA, MEDIA, BAJA

  @Column(nullable = false)
  private String status; // PENDIENTE, EN_PROGRESO, COMPLETADA, CANCELADA

  @Column(nullable = false)
  private String assignedTo; // Nombre del responsable

  @Column(nullable = false)
  private String createdBy; // Usuario que creó la tarea

  @Column(nullable = false)
  private LocalDate dueDate;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  private LocalDateTime completedAt;

  @Column(columnDefinition = "TEXT")
  private String notes;

  @Column
  private String propertyUnit; // Unidad de propiedad relacionada

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public String getPriority() { return priority; }
  public void setPriority(String priority) { this.priority = priority; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getAssignedTo() { return assignedTo; }
  public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

  public LocalDate getDueDate() { return dueDate; }
  public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getCompletedAt() { return completedAt; }
  public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }

  public String getPropertyUnit() { return propertyUnit; }
  public void setPropertyUnit(String propertyUnit) { this.propertyUnit = propertyUnit; }
}
