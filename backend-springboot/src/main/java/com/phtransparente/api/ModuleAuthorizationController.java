package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/module-authorizations")
public class ModuleAuthorizationController {
  private final ModuleAuthorizationRepository moduleAuthorizationRepository;

  public ModuleAuthorizationController(ModuleAuthorizationRepository moduleAuthorizationRepository) {
    this.moduleAuthorizationRepository = moduleAuthorizationRepository;
  }

  @GetMapping
  public List<ModuleAuthorization> getAllModuleAuthorizations() {
    return moduleAuthorizationRepository.findAll();
  }

  @GetMapping("/user/{userId}")
  public List<ModuleAuthorization> getAuthorizationsByUser(@PathVariable Long userId) {
    return moduleAuthorizationRepository.findByUserId(userId);
  }

  @GetMapping("/user/{userId}/active")
  public List<ModuleAuthorization> getActiveAuthorizationsByUser(@PathVariable Long userId) {
    return moduleAuthorizationRepository.findByUserIdAndStatus(userId, "ACTIVO");
  }

  @GetMapping("/module/{moduleName}")
  public List<ModuleAuthorization> getAuthorizationsByModule(@PathVariable String moduleName) {
    return moduleAuthorizationRepository.findByModuleName(moduleName);
  }

  @GetMapping("/user/{userId}/module/{moduleName}")
  public List<ModuleAuthorization> getUserAuthorizationForModule(@PathVariable Long userId, @PathVariable String moduleName) {
    return moduleAuthorizationRepository.findByUserIdAndModuleName(userId, moduleName);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ModuleAuthorization> getModuleAuthorizationById(@PathVariable @NonNull Long id) {
    return moduleAuthorizationRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<ModuleAuthorization> createModuleAuthorization(@RequestBody ModuleAuthorization moduleAuthorization) {
    moduleAuthorization.setCreatedAt(LocalDate.now());
    moduleAuthorization.setUpdatedAt(LocalDate.now());
    moduleAuthorization.setGrantedDate(LocalDate.now());
    if (moduleAuthorization.getStatus() == null) {
      moduleAuthorization.setStatus("ACTIVO");
    }
    if (moduleAuthorization.getIsPermanent() == null) {
      moduleAuthorization.setIsPermanent(false);
    }
    ModuleAuthorization savedModuleAuthorization = moduleAuthorizationRepository.save(moduleAuthorization);
    return ResponseEntity.ok(savedModuleAuthorization);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateModuleAuthorization(@PathVariable @NonNull Long id, @RequestBody ModuleAuthorization moduleAuthorization) {
    return moduleAuthorizationRepository.findById(id)
      .map(existingModuleAuthorization -> {
        existingModuleAuthorization.setUserId(moduleAuthorization.getUserId());
        existingModuleAuthorization.setModuleName(moduleAuthorization.getModuleName());
        existingModuleAuthorization.setPermissionType(moduleAuthorization.getPermissionType());
        existingModuleAuthorization.setExpiryDate(moduleAuthorization.getExpiryDate());
        existingModuleAuthorization.setStatus(moduleAuthorization.getStatus());
        existingModuleAuthorization.setAuthorizationReason(moduleAuthorization.getAuthorizationReason());
        existingModuleAuthorization.setIsPermanent(moduleAuthorization.getIsPermanent());
        existingModuleAuthorization.setUpdatedAt(LocalDate.now());
        
        ModuleAuthorization updatedModuleAuthorization = moduleAuthorizationRepository.save(existingModuleAuthorization);
        return ResponseEntity.ok(updatedModuleAuthorization);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteModuleAuthorization(@PathVariable @NonNull Long id) {
    if (moduleAuthorizationRepository.existsById(id)) {
      moduleAuthorizationRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @PutMapping("/{id}/revoke")
  public ResponseEntity<?> revokeAuthorization(@PathVariable @NonNull Long id, @RequestBody ModuleAuthorization revocation) {
    return moduleAuthorizationRepository.findById(id)
      .map(existingModuleAuthorization -> {
        existingModuleAuthorization.setStatus("REVOCADO");
        existingModuleAuthorization.setRevokedBy(revocation.getRevokedBy());
        existingModuleAuthorization.setRevokedDate(LocalDate.now());
        existingModuleAuthorization.setRevocationReason(revocation.getRevocationReason());
        existingModuleAuthorization.setUpdatedAt(LocalDate.now());
        
        ModuleAuthorization updatedModuleAuthorization = moduleAuthorizationRepository.save(existingModuleAuthorization);
        return ResponseEntity.ok(updatedModuleAuthorization);
      })
      .orElse(ResponseEntity.notFound().build());
  }
}
