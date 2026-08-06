package com.phtransparente.api;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Aplica en el backend los modulos del rol, del plan y permisos de escritura. */
@Component
public class SaasAuthorizationFilter extends OncePerRequestFilter {
  private static final Map<String, String> PATH_MODULES = pathModules();
  private static final Map<String, Set<String>> WRITE_ROLES = writeRoles();

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final SaasAccessService saasAccessService;

  public SaasAuthorizationFilter(UserRepository userRepository, RoleRepository roleRepository,
                                 SaasAccessService saasAccessService) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.saasAccessService = saasAccessService;
  }

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request,
                                  @NonNull HttpServletResponse response,
                                  @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      filterChain.doFilter(request, response);
      return;
    }

    User user = userRepository.findByUsername(authentication.getName());
    if (user == null || ("SUPERADMIN".equalsIgnoreCase(user.getRole())
        && Long.valueOf(0L).equals(user.getOrganizationId()))) {
      filterChain.doFilter(request, response);
      return;
    }

    String module = moduleFor(request.getRequestURI());
    if (module != null) {
      Role role = roleRepository.findByName(user.getRole()).orElse(null);
      String effectiveModules = saasAccessService.effectiveModules(
        user.getOrganizationId(), role == null ? "" : role.getModules());
      Set<String> modules = Set.of(effectiveModules.isBlank()
        ? new String[0]
        : effectiveModules.split(","));
      if (!modules.contains(module)) {
        response.sendError(HttpServletResponse.SC_FORBIDDEN,
          "El modulo no esta habilitado para el rol o el plan contratado");
        return;
      }

      if (isWrite(request.getMethod()) && !canWrite(user.getRole(), module)) {
        response.sendError(HttpServletResponse.SC_FORBIDDEN,
          "El rol no tiene permiso para modificar este modulo");
        return;
      }
    }
    filterChain.doFilter(request, response);
  }

  private static String moduleFor(String uri) {
    return PATH_MODULES.entrySet().stream()
      .filter(entry -> uri.startsWith(entry.getKey()))
      .map(Map.Entry::getValue)
      .findFirst().orElse(null);
  }

  private static boolean isWrite(String method) {
    return Set.of("POST", "PUT", "PATCH", "DELETE").contains(method.toUpperCase());
  }

  private static boolean canWrite(String role, String module) {
    if ("ADMIN".equalsIgnoreCase(role)) return true;
    return WRITE_ROLES.getOrDefault(role.toUpperCase(), Set.of()).contains(module);
  }

  private static Map<String, String> pathModules() {
    Map<String, String> modules = new LinkedHashMap<>();
    modules.put("/api/module-authorizations", "authorizations");
    modules.put("/api/horizontal-property-regulations", "horizontal-property-regulations");
    modules.put("/api/transparency-metrics", "transparency");
    modules.put("/api/insurance-policies", "insurance-policies");
    modules.put("/api/personnel-ratings", "personnel-ratings");
    modules.put("/api/security-findings", "security");
    modules.put("/api/security-events", "security");
    modules.put("/api/security-guards", "security");
    modules.put("/api/security-points", "security");
    modules.put("/api/official-minutes", "official-minutes");
    modules.put("/api/annual-budgets", "annual-budgets");
    modules.put("/api/property-units", "property-units");
    modules.put("/api/support-tasks", "support-tasks");
    modules.put("/api/reserve-funds", "reserve-funds");
    modules.put("/api/bank-accounts", "bank-accounts");
    modules.put("/api/access-control", "security");
    modules.put("/api/audit-logs", "authorizations");
    modules.put("/api/contractors", "contractors");
    modules.put("/api/reservations", "reservations");
    modules.put("/api/assemblies", "assemblies");
    modules.put("/api/documents", "documents");
    modules.put("/api/contracts", "contracts");
    modules.put("/api/councils", "councils");
    modules.put("/api/payments", "payments");
    modules.put("/api/visitors", "visitors");
    modules.put("/api/reports", "reports");
    modules.put("/api/alerts", "alerts");
    modules.put("/api/fines", "fines");
    modules.put("/api/votes", "votes");
    modules.put("/api/pqrs", "pqr");
    modules.put("/api/users", "users");
    modules.put("/api/ai", "reports");
    return modules;
  }

  private static Map<String, Set<String>> writeRoles() {
    return Map.of(
      "CONTADOR", Set.of("payments", "bank-accounts", "reserve-funds", "annual-budgets", "reports", "documents"),
      "REVISOR_FISCAL", Set.of("reports", "documents", "personnel-ratings"),
      "CONSEJERO", Set.of("assemblies", "votes", "councils", "documents", "annual-budgets", "official-minutes", "horizontal-property-regulations", "alerts", "reports", "personnel-ratings", "support-tasks"),
      "COPROPIETARIO", Set.of("pqr", "reservations", "visitors", "votes", "personnel-ratings", "support-tasks"),
      "VIGILANCIA", Set.of("security", "visitors", "alerts", "reports", "support-tasks", "personnel-ratings"),
      "ASEO", Set.of("support-tasks", "reports", "alerts", "personnel-ratings", "documents")
    );
  }
}
