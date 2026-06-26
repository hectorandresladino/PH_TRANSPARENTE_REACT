package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/access-control")
public class AccessControlController {
  private final AccessControlRepository accessControlRepository;

  public AccessControlController(AccessControlRepository accessControlRepository) {
    this.accessControlRepository = accessControlRepository;
  }

  @GetMapping
  public List<AccessControl> getAllAccessControls() {
    return accessControlRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<AccessControl> getAccessControlById(@PathVariable @NonNull Long id) {
    return accessControlRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<AccessControl> createAccessControl(@RequestBody AccessControl accessControl) {
    accessControl.setCreatedAt(LocalDateTime.now());
    if (accessControl.getStatus() == null) {
      accessControl.setStatus("INGRESADO");
    }
    if (accessControl.getEntryTime() == null) {
      accessControl.setEntryTime(LocalDateTime.now());
    }
    AccessControl savedAccessControl = accessControlRepository.save(accessControl);
    return ResponseEntity.ok(savedAccessControl);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateAccessControl(@PathVariable @NonNull Long id, @RequestBody AccessControl accessControl) {
    return accessControlRepository.findById(id)
      .map(existingAccessControl -> {
        existingAccessControl.setAccessType(accessControl.getAccessType());
        existingAccessControl.setPersonName(accessControl.getPersonName());
        existingAccessControl.setDocumentNumber(accessControl.getDocumentNumber());
        existingAccessControl.setDocumentType(accessControl.getDocumentType());
        existingAccessControl.setVehiclePlate(accessControl.getVehiclePlate());
        existingAccessControl.setVehicleType(accessControl.getVehicleType());
        existingAccessControl.setEntryGate(accessControl.getEntryGate());
        existingAccessControl.setExitGate(accessControl.getExitGate());
        existingAccessControl.setEntryTime(accessControl.getEntryTime());
        existingAccessControl.setExitTime(accessControl.getExitTime());
        existingAccessControl.setDestination(accessControl.getDestination());
        existingAccessControl.setPurpose(accessControl.getPurpose());
        existingAccessControl.setHostName(accessControl.getHostName());
        existingAccessControl.setHostUnit(accessControl.getHostUnit());
        existingAccessControl.setStatus(accessControl.getStatus());
        existingAccessControl.setObservations(accessControl.getObservations());
        existingAccessControl.setAuthorizedBy(accessControl.getAuthorizedBy());
        
        if ("SALIDA".equals(accessControl.getStatus()) && existingAccessControl.getExitTime() == null) {
          existingAccessControl.setExitTime(LocalDateTime.now());
        }
        
        AccessControl updatedAccessControl = accessControlRepository.save(existingAccessControl);
        return ResponseEntity.ok(updatedAccessControl);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteAccessControl(@PathVariable @NonNull Long id) {
    if (accessControlRepository.existsById(id)) {
      accessControlRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<AccessControl> getAccessControlsByStatus(@PathVariable String status) {
    return accessControlRepository.findByStatus(status);
  }

  @GetMapping("/type/{type}")
  public List<AccessControl> getAccessControlsByType(@PathVariable String type) {
    return accessControlRepository.findByAccessType(type);
  }

  @GetMapping("/gate/{gate}")
  public List<AccessControl> getAccessControlsByGate(@PathVariable String gate) {
    return accessControlRepository.findByEntryGate(gate);
  }

  @GetMapping("/document/{documentNumber}")
  public List<AccessControl> getAccessControlsByDocument(@PathVariable String documentNumber) {
    return accessControlRepository.findByDocumentNumber(documentNumber);
  }

  @GetMapping("/vehicle/{plate}")
  public List<AccessControl> getAccessControlsByVehicle(@PathVariable String plate) {
    return accessControlRepository.findByVehiclePlate(plate);
  }

  @GetMapping("/unit/{unit}")
  public List<AccessControl> getAccessControlsByUnit(@PathVariable String unit) {
    return accessControlRepository.findByHostUnit(unit);
  }
}
