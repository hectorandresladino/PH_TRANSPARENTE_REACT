package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support-tasks")
public class SupportTaskController {
  private final SupportTaskRepository supportTaskRepository;

  public SupportTaskController(SupportTaskRepository supportTaskRepository) {
    this.supportTaskRepository = supportTaskRepository;
  }

  @GetMapping
  public List<SupportTask> getAllTasks() {
    return supportTaskRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/{id}")
  public ResponseEntity<SupportTask> getTaskById(@PathVariable @NonNull Long id) {
    return supportTaskRepository.findById(id)
      .filter(t -> t.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/status/{status}")
  public List<SupportTask> getTasksByStatus(@PathVariable String status) {
    return supportTaskRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/category/{category}")
  public List<SupportTask> getTasksByCategory(@PathVariable String category) {
    return supportTaskRepository.findByOrganizationIdAndCategory(TenantContext.getOrganizationId(), category);
  }

  @GetMapping("/priority/{priority}")
  public List<SupportTask> getTasksByPriority(@PathVariable String priority) {
    return supportTaskRepository.findByOrganizationIdAndPriority(TenantContext.getOrganizationId(), priority);
  }

  @GetMapping("/assigned/{assignedTo}")
  public List<SupportTask> getTasksByAssignedTo(@PathVariable String assignedTo) {
    return supportTaskRepository.findByOrganizationIdAndAssignedTo(TenantContext.getOrganizationId(), assignedTo);
  }

  @GetMapping("/created-by/{createdBy}")
  public List<SupportTask> getTasksByCreatedBy(@PathVariable String createdBy) {
    return supportTaskRepository.findByOrganizationIdAndCreatedBy(TenantContext.getOrganizationId(), createdBy);
  }

  @GetMapping("/property-unit/{propertyUnit}")
  public List<SupportTask> getTasksByPropertyUnit(@PathVariable String propertyUnit) {
    return supportTaskRepository.findByOrganizationIdAndPropertyUnit(TenantContext.getOrganizationId(), propertyUnit);
  }

  @GetMapping("/pending")
  public List<SupportTask> getPendingTasks() {
    return supportTaskRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), "PENDIENTE");
  }

  @GetMapping("/in-progress")
  public List<SupportTask> getInProgressTasks() {
    return supportTaskRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), "EN_PROGRESO");
  }

  @GetMapping("/completed")
  public List<SupportTask> getCompletedTasks() {
    return supportTaskRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), "COMPLETADA");
  }

  @PostMapping
  public ResponseEntity<SupportTask> createTask(@RequestBody SupportTask task) {
    task.setOrganizationId(TenantContext.getOrganizationId());
    task.setCreatedAt(LocalDateTime.now());
    if (task.getStatus() == null) {
      task.setStatus("PENDIENTE");
    }
    if (task.getPriority() == null) {
      task.setPriority("MEDIA");
    }
    SupportTask savedTask = supportTaskRepository.save(task);
    return ResponseEntity.ok(savedTask);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateTask(@PathVariable @NonNull Long id, @RequestBody SupportTask task) {
    Long orgId = TenantContext.getOrganizationId();
    return supportTaskRepository.findById(id)
      .filter(existingTask -> existingTask.getOrganizationId().equals(orgId))
      .map(existingTask -> {
        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setCategory(task.getCategory());
        existingTask.setPriority(task.getPriority());
        existingTask.setStatus(task.getStatus());
        existingTask.setAssignedTo(task.getAssignedTo());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setNotes(task.getNotes());
        existingTask.setPropertyUnit(task.getPropertyUnit());
        
        // Si se completa la tarea, registrar la fecha de completado
        if ("COMPLETADA".equals(task.getStatus()) && existingTask.getCompletedAt() == null) {
          existingTask.setCompletedAt(LocalDateTime.now());
        }
        
        SupportTask updatedTask = supportTaskRepository.save(existingTask);
        return ResponseEntity.ok(updatedTask);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteTask(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    return supportTaskRepository.findById(id)
      .filter(t -> t.getOrganizationId().equals(orgId))
      .map(t -> {
        supportTaskRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }
}
