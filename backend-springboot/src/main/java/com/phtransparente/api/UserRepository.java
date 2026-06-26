package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  User findByUsername(String username);
  boolean existsByUsername(String username);
  List<User> findByRole(String role);
  List<User> findByActive(Boolean active);
}
