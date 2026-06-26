package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assemblies")
public class AssemblyController {
  private final AssemblyRepository assemblyRepository;

  public AssemblyController(AssemblyRepository assemblyRepository) {
    this.assemblyRepository = assemblyRepository;
  }

  @GetMapping
  public List<Assembly> getAllAssemblies() {
    return assemblyRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Assembly> getAssemblyById(@PathVariable @NonNull Long id) {
    return assemblyRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Assembly> createAssembly(@RequestBody Assembly assembly) {
    assembly.setCreatedAt(LocalDateTime.now());
    if (assembly.getStatus() == null) {
      assembly.setStatus("PROGRAMADA");
    }
    Assembly savedAssembly = assemblyRepository.save(assembly);
    return ResponseEntity.ok(savedAssembly);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateAssembly(@PathVariable @NonNull Long id, @RequestBody Assembly assembly) {
    return assemblyRepository.findById(id)
      .map(existingAssembly -> {
        existingAssembly.setTitle(assembly.getTitle());
        existingAssembly.setDescription(assembly.getDescription());
        existingAssembly.setType(assembly.getType());
        existingAssembly.setScheduledDate(assembly.getScheduledDate());
        existingAssembly.setScheduledTime(assembly.getScheduledTime());
        existingAssembly.setLocation(assembly.getLocation());
        existingAssembly.setStatus(assembly.getStatus());
        existingAssembly.setAgenda(assembly.getAgenda());
        existingAssembly.setMinutes(assembly.getMinutes());
        existingAssembly.setQuorumRequired(assembly.getQuorumRequired());
        existingAssembly.setQuorumAttended(assembly.getQuorumAttended());
        
        Assembly updatedAssembly = assemblyRepository.save(existingAssembly);
        return ResponseEntity.ok(updatedAssembly);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteAssembly(@PathVariable @NonNull Long id) {
    if (assemblyRepository.existsById(id)) {
      assemblyRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Assembly> getAssembliesByStatus(@PathVariable String status) {
    return assemblyRepository.findByStatus(status);
  }

  @GetMapping("/type/{type}")
  public List<Assembly> getAssembliesByType(@PathVariable String type) {
    return assemblyRepository.findByType(type);
  }

  @GetMapping("/creator/{createdBy}")
  public List<Assembly> getAssembliesByCreator(@PathVariable String createdBy) {
    return assemblyRepository.findByCreatedBy(createdBy);
  }
}
