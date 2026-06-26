package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
  List<Payment> findByStatus(String status);
  List<Payment> findByUserId(String userId);
  List<Payment> findByPaymentMethod(String paymentMethod);
}
