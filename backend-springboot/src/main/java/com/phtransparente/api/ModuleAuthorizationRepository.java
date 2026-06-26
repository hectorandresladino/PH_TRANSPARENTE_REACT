package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleAuthorizationRepository extends JpaRepository<ModuleAuthorization, Long> {
  List<ModuleAuthorization> findByUserId(Long userId);
  List<ModuleAuthorization> findByModuleName(String moduleName);
  List<ModuleAuthorization> findByUserIdAndStatus(Long userId, String status);
  List<ModuleAuthorization> findByUserIdAndModuleName(Long userId, String moduleName);
  List<ModuleAuthorization> findByStatus(String status);
  List<ModuleAuthorization> findByPermissionType(String permissionType);
}
