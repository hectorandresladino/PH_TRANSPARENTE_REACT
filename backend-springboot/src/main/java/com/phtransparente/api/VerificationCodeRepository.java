package com.phtransparente.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
  Optional<VerificationCode> findByUsernameAndUsedFalse(String username);
  Optional<VerificationCode> findByCode(String code);
  void deleteByUsername(String username);
}
