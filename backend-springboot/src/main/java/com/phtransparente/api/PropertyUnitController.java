package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/property-units")
public class PropertyUnitController {
  private final PropertyUnitRepository propertyUnitRepository;

  public PropertyUnitController(PropertyUnitRepository propertyUnitRepository) {
    this.propertyUnitRepository = propertyUnitRepository;
  }

  @GetMapping
  public List<PropertyUnit> getAllPropertyUnits() {
    return propertyUnitRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<PropertyUnit> getPropertyUnitById(@PathVariable @NonNull Long id) {
    return propertyUnitRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<PropertyUnit> createPropertyUnit(@RequestBody PropertyUnit propertyUnit) {
    propertyUnit.setCreatedAt(LocalDate.now());
    propertyUnit.setUpdatedAt(LocalDate.now());
    if (propertyUnit.getStatus() == null) {
      propertyUnit.setStatus("ACTIVO");
    }
    PropertyUnit savedPropertyUnit = propertyUnitRepository.save(propertyUnit);
    return ResponseEntity.ok(savedPropertyUnit);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updatePropertyUnit(@PathVariable @NonNull Long id, @RequestBody PropertyUnit propertyUnit) {
    return propertyUnitRepository.findById(id)
      .map(existingPropertyUnit -> {
        existingPropertyUnit.setUnitNumber(propertyUnit.getUnitNumber());
        existingPropertyUnit.setUnitType(propertyUnit.getUnitType());
        existingPropertyUnit.setArea(propertyUnit.getArea());
        existingPropertyUnit.setPrivateArea(propertyUnit.getPrivateArea());
        existingPropertyUnit.setCommonArea(propertyUnit.getCommonArea());
        existingPropertyUnit.setTotalArea(propertyUnit.getTotalArea());
        existingPropertyUnit.setOwnershipCoefficient(propertyUnit.getOwnershipCoefficient());
        existingPropertyUnit.setFloorNumber(propertyUnit.getFloorNumber());
        existingPropertyUnit.setBlock(propertyUnit.getBlock());
        existingPropertyUnit.setBuilding(propertyUnit.getBuilding());
        existingPropertyUnit.setPropertyType(propertyUnit.getPropertyType());
        existingPropertyUnit.setAddress(propertyUnit.getAddress());
        existingPropertyUnit.setCity(propertyUnit.getCity());
        existingPropertyUnit.setStatus(propertyUnit.getStatus());
        existingPropertyUnit.setConstructionYear(propertyUnit.getConstructionYear());
        existingPropertyUnit.setDescription(propertyUnit.getDescription());
        existingPropertyUnit.setNumberOfRooms(propertyUnit.getNumberOfRooms());
        existingPropertyUnit.setNumberOfBathrooms(propertyUnit.getNumberOfBathrooms());
        existingPropertyUnit.setNumberOfParkingSpaces(propertyUnit.getNumberOfParkingSpaces());
        existingPropertyUnit.setHasBalcony(propertyUnit.getHasBalcony());
        existingPropertyUnit.setHasTerrace(propertyUnit.getHasTerrace());
        existingPropertyUnit.setHasStorage(propertyUnit.getHasStorage());
        existingPropertyUnit.setObservations(propertyUnit.getObservations());
        existingPropertyUnit.setCurrentOwnerId(propertyUnit.getCurrentOwnerId());
        existingPropertyUnit.setPurchaseDate(propertyUnit.getPurchaseDate());
        existingPropertyUnit.setPurchaseValue(propertyUnit.getPurchaseValue());
        existingPropertyUnit.setCurrentAssessmentValue(propertyUnit.getCurrentAssessmentValue());
        existingPropertyUnit.setUpdatedAt(LocalDate.now());
        existingPropertyUnit.setUpdatedBy(propertyUnit.getUpdatedBy());
        
        PropertyUnit updatedPropertyUnit = propertyUnitRepository.save(existingPropertyUnit);
        return ResponseEntity.ok(updatedPropertyUnit);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deletePropertyUnit(@PathVariable @NonNull Long id) {
    if (propertyUnitRepository.existsById(id)) {
      propertyUnitRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<PropertyUnit> getPropertyUnitsByStatus(@PathVariable String status) {
    return propertyUnitRepository.findByStatus(status);
  }

  @GetMapping("/type/{unitType}")
  public List<PropertyUnit> getPropertyUnitsByType(@PathVariable String unitType) {
    return propertyUnitRepository.findByUnitType(unitType);
  }

  @GetMapping("/block/{block}")
  public List<PropertyUnit> getPropertyUnitsByBlock(@PathVariable String block) {
    return propertyUnitRepository.findByBlock(block);
  }

  @GetMapping("/floor/{floorNumber}")
  public List<PropertyUnit> getPropertyUnitsByFloor(@PathVariable Integer floorNumber) {
    return propertyUnitRepository.findByFloorNumber(floorNumber);
  }

  @GetMapping("/owner/{ownerId}")
  public List<PropertyUnit> getPropertyUnitsByOwner(@PathVariable Long ownerId) {
    return propertyUnitRepository.findByCurrentOwnerId(ownerId);
  }

  @GetMapping("/building/{building}")
  public List<PropertyUnit> getPropertyUnitsByBuilding(@PathVariable String building) {
    return propertyUnitRepository.findByBuilding(building);
  }
}
