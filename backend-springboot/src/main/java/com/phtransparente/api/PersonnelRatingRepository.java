package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonnelRatingRepository extends JpaRepository<PersonnelRating, Long> {
  List<PersonnelRating> findByOrganizationId(Long organizationId);
  List<PersonnelRating> findByOrganizationIdAndRatedPersonId(Long organizationId, Long ratedPersonId);
  List<PersonnelRating> findByOrganizationIdAndRatedPersonRole(Long organizationId, String ratedPersonRole);
  List<PersonnelRating> findByOrganizationIdAndRatedPersonType(Long organizationId, String ratedPersonType);
  List<PersonnelRating> findByOrganizationIdAndRaterId(Long organizationId, Long raterId);
  List<PersonnelRating> findByOrganizationIdAndPropertyUnitId(Long organizationId, Long propertyUnitId);
  List<PersonnelRating> findByOrganizationIdAndRatingPeriod(Long organizationId, String ratingPeriod);
  List<PersonnelRating> findByOrganizationIdAndRatingCategory(Long organizationId, String ratingCategory);
  List<PersonnelRating> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<PersonnelRating> findByOrganizationIdAndRatingDateBetween(Long organizationId, LocalDate startDate, LocalDate endDate);
  List<PersonnelRating> findByOrganizationIdAndRatedPersonRoleAndRatingPeriod(Long organizationId, String ratedPersonRole, String ratingPeriod);
}
