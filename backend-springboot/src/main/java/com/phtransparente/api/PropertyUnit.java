package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "property_units")
public class PropertyUnit {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String unitNumber;

  @Column(nullable = false)
  private String unitType;

  private Double area;
  
  @Column(name = "private_area")
  private Double privateArea;
  
  @Column(name = "common_area")
  private Double commonArea;
  
  @Column(name = "total_area")
  private Double totalArea;

  @Column(name = "ownership_coefficient", nullable = false)
  private Double ownershipCoefficient;

  @Column(name = "floor_number")
  private Integer floorNumber;

  private String block;

  private String building;

  @Column(name = "property_type")
  private String propertyType;

  private String address;

  private String city;

  private String status;

  @Column(name = "construction_year")
  private Integer constructionYear;

  private String description;

  @Column(name = "number_of_rooms")
  private Integer numberOfRooms;

  @Column(name = "number_of_bathrooms")
  private Integer numberOfBathrooms;

  @Column(name = "number_of_parking_spaces")
  private Integer numberOfParkingSpaces;

  @Column(name = "has_balcony")
  private Boolean hasBalcony;

  @Column(name = "has_terrace")
  private Boolean hasTerrace;

  @Column(name = "has_storage")
  private Boolean hasStorage;

  private String observations;

  @Column(name = "current_owner_id")
  private Long currentOwnerId;

  @Column(name = "purchase_date")
  private LocalDate purchaseDate;

  @Column(name = "purchase_value")
  private String purchaseValue;

  @Column(name = "current_assessment_value")
  private String currentAssessmentValue;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  @Column(name = "updated_by")
  private String updatedBy;

  public PropertyUnit() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getUnitNumber() { return unitNumber; }
  public void setUnitNumber(String unitNumber) { this.unitNumber = unitNumber; }

  public String getUnitType() { return unitType; }
  public void setUnitType(String unitType) { this.unitType = unitType; }

  public Double getArea() { return area; }
  public void setArea(Double area) { this.area = area; }

  public Double getPrivateArea() { return privateArea; }
  public void setPrivateArea(Double privateArea) { this.privateArea = privateArea; }

  public Double getCommonArea() { return commonArea; }
  public void setCommonArea(Double commonArea) { this.commonArea = commonArea; }

  public Double getTotalArea() { return totalArea; }
  public void setTotalArea(Double totalArea) { this.totalArea = totalArea; }

  public Double getOwnershipCoefficient() { return ownershipCoefficient; }
  public void setOwnershipCoefficient(Double ownershipCoefficient) { this.ownershipCoefficient = ownershipCoefficient; }

  public Integer getFloorNumber() { return floorNumber; }
  public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }

  public String getBlock() { return block; }
  public void setBlock(String block) { this.block = block; }

  public String getBuilding() { return building; }
  public void setBuilding(String building) { this.building = building; }

  public String getPropertyType() { return propertyType; }
  public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }

  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public Integer getConstructionYear() { return constructionYear; }
  public void setConstructionYear(Integer constructionYear) { this.constructionYear = constructionYear; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public Integer getNumberOfRooms() { return numberOfRooms; }
  public void setNumberOfRooms(Integer numberOfRooms) { this.numberOfRooms = numberOfRooms; }

  public Integer getNumberOfBathrooms() { return numberOfBathrooms; }
  public void setNumberOfBathrooms(Integer numberOfBathrooms) { this.numberOfBathrooms = numberOfBathrooms; }

  public Integer getNumberOfParkingSpaces() { return numberOfParkingSpaces; }
  public void setNumberOfParkingSpaces(Integer numberOfParkingSpaces) { this.numberOfParkingSpaces = numberOfParkingSpaces; }

  public Boolean getHasBalcony() { return hasBalcony; }
  public void setHasBalcony(Boolean hasBalcony) { this.hasBalcony = hasBalcony; }

  public Boolean getHasTerrace() { return hasTerrace; }
  public void setHasTerrace(Boolean hasTerrace) { this.hasTerrace = hasTerrace; }

  public Boolean getHasStorage() { return hasStorage; }
  public void setHasStorage(Boolean hasStorage) { this.hasStorage = hasStorage; }

  public String getObservations() { return observations; }
  public void setObservations(String observations) { this.observations = observations; }

  public Long getCurrentOwnerId() { return currentOwnerId; }
  public void setCurrentOwnerId(Long currentOwnerId) { this.currentOwnerId = currentOwnerId; }

  public LocalDate getPurchaseDate() { return purchaseDate; }
  public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

  public String getPurchaseValue() { return purchaseValue; }
  public void setPurchaseValue(String purchaseValue) { this.purchaseValue = purchaseValue; }

  public String getCurrentAssessmentValue() { return currentAssessmentValue; }
  public void setCurrentAssessmentValue(String currentAssessmentValue) { this.currentAssessmentValue = currentAssessmentValue; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

  public String getUpdatedBy() { return updatedBy; }
  public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
