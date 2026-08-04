package com.phtransparente.api;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleAuthorizationRepository extends JpaRepository<ModuleAuthorization, Long> {
  List<ModuleAuthorization> findByOrganizationId(Long organizationId);
  List<ModuleAuthorization> findByOrganizationIdAndUserId(Long organizationId, Long userId);
  List<ModuleAuthorization> findByOrganizationIdAndModuleName(Long organizationId, String moduleName);
  List<ModuleAuthorization> findByOrganizationIdAndUserIdAndStatus(Long organizationId, Long userId, String status);
  List<ModuleAuthorization> findByOrganizationIdAndUserIdAndModuleName(Long organizationId, Long userId, String moduleName);
  List<ModuleAuthorization> findByOrganizationIdAndStatus(Long organizationId, String status);
  List<ModuleAuthorization> findByOrganizationIdAndPermissionType(Long organizationId, String permissionType);
}
