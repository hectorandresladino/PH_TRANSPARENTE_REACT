package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReserveFundRepository extends JpaRepository<ReserveFund, Long> {
  List<ReserveFund> findByStatus(String status);
  List<ReserveFund> findByFundType(String fundType);
  ReserveFund findByFundName(String fundName);
}
