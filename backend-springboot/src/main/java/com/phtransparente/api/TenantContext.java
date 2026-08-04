package com.phtransparente.api;

/**
 * Contexto de tenant para aislamiento de datos en cada request.
 * Se establece en JwtAuthenticationFilter y se consume en servicios/repositorios.
 */
public class TenantContext {
  private static final ThreadLocal<Long> currentOrganizationId = new ThreadLocal<>();

  public static void setOrganizationId(Long organizationId) {
    currentOrganizationId.set(organizationId);
  }

  public static Long getOrganizationId() {
    return currentOrganizationId.get();
  }

  public static void clear() {
    currentOrganizationId.remove();
  }
}
