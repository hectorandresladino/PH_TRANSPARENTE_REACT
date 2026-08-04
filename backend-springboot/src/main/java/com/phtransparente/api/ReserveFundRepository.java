package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReserveFundRepository extends JpaRepository<ReserveFund, Long> {
  List<ReserveFund> findByOrganizationId(Long organizationId);
  List<ReserveFund> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<ReserveFund> findByOrganizationIdAndFundType(Long organizationId, String fundType);
  ReserveFund findByOrganizationIdAndFundName(Long organizationId, String fundName);
}
