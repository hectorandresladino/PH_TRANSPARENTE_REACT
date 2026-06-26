package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
  private final PaymentRepository paymentRepository;

  public PaymentController(PaymentRepository paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  @GetMapping
  public List<Payment> getAllPayments() {
    return paymentRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Payment> getPaymentById(@PathVariable @NonNull Long id) {
    return paymentRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
    payment.setCreatedAt(LocalDate.now());
    if (payment.getStatus() == null) {
      payment.setStatus("PENDIENTE");
    }
    Payment savedPayment = paymentRepository.save(payment);
    return ResponseEntity.ok(savedPayment);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updatePayment(@PathVariable @NonNull Long id, @RequestBody Payment payment) {
    return paymentRepository.findById(id)
      .map(existingPayment -> {
        existingPayment.setInvoiceNumber(payment.getInvoiceNumber());
        existingPayment.setConcept(payment.getConcept());
        existingPayment.setAmount(payment.getAmount());
        existingPayment.setStatus(payment.getStatus());
        existingPayment.setPaymentMethod(payment.getPaymentMethod());
        existingPayment.setReferenceNumber(payment.getReferenceNumber());
        existingPayment.setDueDate(payment.getDueDate());
        existingPayment.setDescription(payment.getDescription());
        existingPayment.setUserId(payment.getUserId());
        
        if ("PAGADO".equals(payment.getStatus()) && existingPayment.getPaymentDate() == null) {
          existingPayment.setPaymentDate(LocalDate.now());
        }
        
        Payment updatedPayment = paymentRepository.save(existingPayment);
        return ResponseEntity.ok(updatedPayment);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deletePayment(@PathVariable @NonNull Long id) {
    if (paymentRepository.existsById(id)) {
      paymentRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Payment> getPaymentsByStatus(@PathVariable String status) {
    return paymentRepository.findByStatus(status);
  }

  @GetMapping("/user/{userId}")
  public List<Payment> getPaymentsByUser(@PathVariable String userId) {
    return paymentRepository.findByUserId(userId);
  }

  @GetMapping("/method/{method}")
  public List<Payment> getPaymentsByMethod(@PathVariable String method) {
    return paymentRepository.findByPaymentMethod(method);
  }
}
