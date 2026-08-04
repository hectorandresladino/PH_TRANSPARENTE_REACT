package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
  List<Payment> findByOrganizationId(Long organizationId);
  List<Payment> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<Payment> findByOrganizationIdAndUserId(Long organizationId, String userId);
  List<Payment> findByOrganizationIdAndPaymentMethod(Long organizationId, String paymentMethod);
}
