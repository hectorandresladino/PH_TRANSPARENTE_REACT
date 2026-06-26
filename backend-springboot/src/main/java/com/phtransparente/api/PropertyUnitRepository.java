package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyUnitRepository extends JpaRepository<PropertyUnit, Long> {
  List<PropertyUnit> findByStatus(String status);
  List<PropertyUnit> findByUnitType(String unitType);
  List<PropertyUnit> findByBlock(String block);
  List<PropertyUnit> findByFloorNumber(Integer floorNumber);
  List<PropertyUnit> findByCurrentOwnerId(Long currentOwnerId);
  List<PropertyUnit> findByBuilding(String building);
  PropertyUnit findByUnitNumber(String unitNumber);
}
