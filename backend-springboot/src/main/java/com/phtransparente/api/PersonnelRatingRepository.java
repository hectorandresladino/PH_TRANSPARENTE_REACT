package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonnelRatingRepository extends JpaRepository<PersonnelRating, Long> {
  List<PersonnelRating> findByRatedPersonId(Long ratedPersonId);
  List<PersonnelRating> findByRatedPersonRole(String ratedPersonRole);
  List<PersonnelRating> findByRatedPersonType(String ratedPersonType);
  List<PersonnelRating> findByRaterId(Long raterId);
  List<PersonnelRating> findByPropertyUnitId(Long propertyUnitId);
  List<PersonnelRating> findByRatingPeriod(String ratingPeriod);
  List<PersonnelRating> findByRatingCategory(String ratingCategory);
  List<PersonnelRating> findByStatus(String status);
  List<PersonnelRating> findByRatingDateBetween(LocalDate startDate, LocalDate endDate);
  List<PersonnelRating> findByRatedPersonRoleAndRatingPeriod(String ratedPersonRole, String ratingPeriod);
}
