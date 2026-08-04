package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyUnitRepository extends JpaRepository<PropertyUnit, Long> {
  List<PropertyUnit> findByOrganizationId(Long organizationId);
  List<PropertyUnit> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<PropertyUnit> findByOrganizationIdAndUnitType(Long organizationId, String unitType);
  List<PropertyUnit> findByOrganizationIdAndBlock(Long organizationId, String block);
  List<PropertyUnit> findByOrganizationIdAndFloorNumber(Long organizationId, Integer floorNumber);
  List<PropertyUnit> findByOrganizationIdAndCurrentOwnerId(Long organizationId, Long currentOwnerId);
  List<PropertyUnit> findByOrganizationIdAndBuilding(Long organizationId, String building);
  PropertyUnit findByOrganizationIdAndUnitNumber(Long organizationId, String unitNumber);
}
