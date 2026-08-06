package com.phtransparente.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SaasAccessServiceTest {
  private OrganizationRepository organizationRepository;
  private SubscriptionRepository subscriptionRepository;
  private PlanRepository planRepository;
  private UserRepository userRepository;
  private PropertyUnitRepository propertyUnitRepository;
  private SaasAccessService service;

  @BeforeEach
  void setUp() {
    organizationRepository = mock(OrganizationRepository.class);
    subscriptionRepository = mock(SubscriptionRepository.class);
    planRepository = mock(PlanRepository.class);
    userRepository = mock(UserRepository.class);
    propertyUnitRepository = mock(PropertyUnitRepository.class);
    service = new SaasAccessService(organizationRepository, subscriptionRepository,
      planRepository, userRepository, propertyUnitRepository);
  }

  @Test
  void activeTenantWithActiveSubscriptionIsAllowed() {
    stubActiveTenant();
    assertTrue(service.validateAccess(7L, "ADMIN").allowed());
  }

  @Test
  void expiredTrialIsDenied() {
    Organization organization = organization("TRIAL");
    organization.setTrialEndsAt(LocalDateTime.now().minusMinutes(1));
    when(organizationRepository.findById(7L)).thenReturn(Optional.of(organization));

    SaasAccessService.AccessDecision decision = service.validateAccess(7L, "ADMIN");

    assertFalse(decision.allowed());
    assertTrue(decision.message().contains("prueba"));
  }

  @Test
  void expiredSubscriptionIsDenied() {
    Organization organization = organization("ACTIVE");
    Subscription subscription = subscription("ACTIVE");
    subscription.setEndDate(LocalDate.now().minusDays(1));
    when(organizationRepository.findById(7L)).thenReturn(Optional.of(organization));
    when(subscriptionRepository.findByOrganizationId(7L)).thenReturn(Optional.of(subscription));

    SaasAccessService.AccessDecision decision = service.validateAccess(7L, "ADMIN");

    assertFalse(decision.allowed());
    assertTrue(decision.message().contains("vencio"));
  }

  @Test
  void effectiveModulesAreIntersectionOfRoleAndPlan() {
    Subscription subscription = subscription("ACTIVE");
    Plan plan = plan();
    plan.setModules("dashboard,pqr,reports");
    when(subscriptionRepository.findByOrganizationId(7L)).thenReturn(Optional.of(subscription));
    when(planRepository.findById(3L)).thenReturn(Optional.of(plan));

    assertEquals("dashboard,pqr", service.effectiveModules(7L, "dashboard,pqr,payments"));
  }

  @Test
  void tenantLimitsUseOrganizationCounters() {
    Organization organization = organization("ACTIVE");
    organization.setMaxUsers(2);
    organization.setMaxUnits(3);
    when(organizationRepository.findById(7L)).thenReturn(Optional.of(organization));
    when(userRepository.countByOrganizationId(7L)).thenReturn(2L);
    when(propertyUnitRepository.countByOrganizationId(7L)).thenReturn(2L);

    assertTrue(service.hasReachedUserLimit(7L));
    assertFalse(service.hasReachedUnitLimit(7L));
  }

  @Test
  void platformSuperadminDoesNotRequireTenantSubscription() {
    assertTrue(service.validateAccess(0L, "SUPERADMIN").allowed());
  }

  private void stubActiveTenant() {
    when(organizationRepository.findById(7L)).thenReturn(Optional.of(organization("ACTIVE")));
    when(subscriptionRepository.findByOrganizationId(7L)).thenReturn(Optional.of(subscription("ACTIVE")));
    when(planRepository.findById(3L)).thenReturn(Optional.of(plan()));
  }

  private Organization organization(String status) {
    Organization organization = new Organization();
    organization.setId(7L);
    organization.setSlug("tenant-7");
    organization.setName("Tenant 7");
    organization.setStatus(status);
    organization.setPlanId(3L);
    return organization;
  }

  private Subscription subscription(String status) {
    Subscription subscription = new Subscription();
    subscription.setOrganizationId(7L);
    subscription.setPlanId(3L);
    subscription.setStatus(status);
    return subscription;
  }

  private Plan plan() {
    Plan plan = new Plan();
    plan.setId(3L);
    plan.setCode("PRO");
    plan.setName("Profesional");
    plan.setActive(true);
    plan.setModules("dashboard");
    return plan;
  }
}
