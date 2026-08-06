package com.phtransparente.api;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/** Centraliza las reglas de acceso, plan y suscripcion de cada tenant. */
@Service
public class SaasAccessService {
  private final OrganizationRepository organizationRepository;
  private final SubscriptionRepository subscriptionRepository;
  private final PlanRepository planRepository;
  private final UserRepository userRepository;
  private final PropertyUnitRepository propertyUnitRepository;

  public SaasAccessService(OrganizationRepository organizationRepository,
                           SubscriptionRepository subscriptionRepository,
                           PlanRepository planRepository,
                           UserRepository userRepository,
                           PropertyUnitRepository propertyUnitRepository) {
    this.organizationRepository = organizationRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.planRepository = planRepository;
    this.userRepository = userRepository;
    this.propertyUnitRepository = propertyUnitRepository;
  }

  public AccessDecision validateAccess(Long organizationId, String role) {
    if ("SUPERADMIN".equalsIgnoreCase(role) && Long.valueOf(0L).equals(organizationId)) {
      return AccessDecision.granted();
    }
    if (organizationId == null || organizationId <= 0) {
      return AccessDecision.denied("El usuario no pertenece a una organizacion valida");
    }

    Organization organization = organizationRepository.findById(organizationId).orElse(null);
    if (organization == null) {
      return AccessDecision.denied("La organizacion no existe");
    }
    String organizationStatus = normalize(organization.getStatus());
    if (!Set.of("ACTIVE", "TRIAL").contains(organizationStatus)) {
      return AccessDecision.denied("La organizacion esta " + organizationStatus.toLowerCase(Locale.ROOT));
    }
    if ("TRIAL".equals(organizationStatus)
        && organization.getTrialEndsAt() != null
        && organization.getTrialEndsAt().isBefore(LocalDateTime.now())) {
      return AccessDecision.denied("El periodo de prueba de la organizacion vencio");
    }

    Subscription subscription = subscriptionRepository.findByOrganizationId(organizationId).orElse(null);
    if (subscription == null) {
      return AccessDecision.denied("La organizacion no tiene una suscripcion");
    }
    String subscriptionStatus = normalize(subscription.getStatus());
    if (!Set.of("ACTIVE", "TRIAL").contains(subscriptionStatus)) {
      return AccessDecision.denied("La suscripcion esta " + subscriptionStatus.toLowerCase(Locale.ROOT));
    }
    LocalDate today = LocalDate.now();
    if ("TRIAL".equals(subscriptionStatus)
        && subscription.getTrialEndsAt() != null
        && subscription.getTrialEndsAt().isBefore(today)) {
      return AccessDecision.denied("El periodo de prueba de la suscripcion vencio");
    }
    if (subscription.getEndDate() != null && subscription.getEndDate().isBefore(today)) {
      return AccessDecision.denied("La suscripcion vencio");
    }

    Plan plan = planRepository.findById(subscription.getPlanId()).orElse(null);
    if (plan == null || !Boolean.TRUE.equals(plan.getActive())) {
      return AccessDecision.denied("El plan contratado no esta disponible");
    }
    return AccessDecision.granted();
  }

  public String effectiveModules(Long organizationId, String roleModules) {
    if (organizationId == null || organizationId == 0L) {
      return roleModules == null ? "" : roleModules;
    }
    Subscription subscription = subscriptionRepository.findByOrganizationId(organizationId).orElse(null);
    Plan plan = subscription == null ? null : planRepository.findById(subscription.getPlanId()).orElse(null);
    if (plan == null) return "";

    Set<String> enabledByPlan = splitModules(plan.getModules());
    return splitModules(roleModules).stream()
      .filter(enabledByPlan::contains)
      .collect(Collectors.joining(","));
  }

  public boolean hasReachedUserLimit(Long organizationId) {
    Organization organization = requireOrganization(organizationId);
    return userRepository.countByOrganizationId(organizationId) >= organization.getMaxUsers();
  }

  public boolean hasReachedUnitLimit(Long organizationId) {
    Organization organization = requireOrganization(organizationId);
    return propertyUnitRepository.countByOrganizationId(organizationId) >= organization.getMaxUnits();
  }

  public AccountSummary accountSummary(Long organizationId) {
    Organization organization = requireOrganization(organizationId);
    Subscription subscription = subscriptionRepository.findByOrganizationId(organizationId)
      .orElseThrow(() -> new IllegalStateException("La organizacion no tiene suscripcion"));
    Plan plan = planRepository.findById(subscription.getPlanId())
      .orElseThrow(() -> new IllegalStateException("El plan de la organizacion no existe"));
    return new AccountSummary(
      organization.getId(), organization.getSlug(), organization.getName(), organization.getStatus(),
      plan.getCode(), plan.getName(), subscription.getStatus(), subscription.getTrialEndsAt(),
      subscription.getEndDate(), userRepository.countByOrganizationId(organizationId),
      organization.getMaxUsers(), propertyUnitRepository.countByOrganizationId(organizationId),
      organization.getMaxUnits(), plan.getModules());
  }

  private Organization requireOrganization(Long organizationId) {
    if (organizationId == null || organizationId <= 0) {
      throw new IllegalStateException("No hay una organizacion activa en la solicitud");
    }
    return organizationRepository.findById(organizationId)
      .orElseThrow(() -> new IllegalStateException("La organizacion no existe"));
  }

  private static Set<String> splitModules(String modules) {
    if (modules == null || modules.isBlank()) return Set.of();
    return Arrays.stream(modules.split(","))
      .map(String::trim)
      .filter(value -> !value.isBlank())
      .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  private static String normalize(String value) {
    return value == null ? "UNKNOWN" : value.trim().toUpperCase(Locale.ROOT);
  }

  public record AccessDecision(boolean allowed, String message) {
    public static AccessDecision granted() { return new AccessDecision(true, null); }
    public static AccessDecision denied(String message) { return new AccessDecision(false, message); }
  }

  public record AccountSummary(Long organizationId, String organizationSlug, String organizationName,
                               String organizationStatus, String planCode, String planName,
                               String subscriptionStatus, LocalDate trialEndsAt, LocalDate endDate,
                               long users, int maxUsers, long units, int maxUnits, String modules) {}
}
