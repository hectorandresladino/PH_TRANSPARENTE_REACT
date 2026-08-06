package com.phtransparente.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
  Optional<VerificationCode> findByUsernameAndUsedFalse(String username);
  Optional<VerificationCode> findByUsernameAndCode(String username, String code);
  void deleteByUsername(String username);
  List<VerificationCode> findByOrganizationId(Long organizationId);
}
