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
    return moduleAuthorizationRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/user/{userId}")
  public List<ModuleAuthorization> getAuthorizationsByUser(@PathVariable Long userId) {
    return moduleAuthorizationRepository.findByOrganizationIdAndUserId(TenantContext.getOrganizationId(), userId);
  }

  @GetMapping("/user/{userId}/active")
  public List<ModuleAuthorization> getActiveAuthorizationsByUser(@PathVariable Long userId) {
    return moduleAuthorizationRepository.findByOrganizationIdAndUserIdAndStatus(TenantContext.getOrganizationId(), userId, "ACTIVO");
  }

  @GetMapping("/module/{moduleName}")
  public List<ModuleAuthorization> getAuthorizationsByModule(@PathVariable String moduleName) {
    return moduleAuthorizationRepository.findByOrganizationIdAndModuleName(TenantContext.getOrganizationId(), moduleName);
  }

  @GetMapping("/user/{userId}/module/{moduleName}")
  public List<ModuleAuthorization> getUserAuthorizationForModule(@PathVariable Long userId, @PathVariable String moduleName) {
    return moduleAuthorizationRepository.findByOrganizationIdAndUserIdAndModuleName(TenantContext.getOrganizationId(), userId, moduleName);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ModuleAuthorization> getModuleAuthorizationById(@PathVariable @NonNull Long id) {
    return moduleAuthorizationRepository.findById(id)
      .filter(a -> a.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<ModuleAuthorization> createModuleAuthorization(@RequestBody ModuleAuthorization moduleAuthorization) {
    moduleAuthorization.setOrganizationId(TenantContext.getOrganizationId());
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
    Long orgId = TenantContext.getOrganizationId();
    return moduleAuthorizationRepository.findById(id)
      .filter(existingModuleAuthorization -> existingModuleAuthorization.getOrganizationId().equals(orgId))
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
    Long orgId = TenantContext.getOrganizationId();
    return moduleAuthorizationRepository.findById(id)
      .filter(a -> a.getOrganizationId().equals(orgId))
      .map(a -> {
        moduleAuthorizationRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}/revoke")
  public ResponseEntity<?> revokeAuthorization(@PathVariable @NonNull Long id, @RequestBody ModuleAuthorization revocation) {
    Long orgId = TenantContext.getOrganizationId();
    return moduleAuthorizationRepository.findById(id)
      .filter(existingModuleAuthorization -> existingModuleAuthorization.getOrganizationId().equals(orgId))
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
