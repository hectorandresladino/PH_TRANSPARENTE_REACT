package com.phtransparente.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/superadmin")
@PreAuthorize("hasRole('SUPERADMIN')")
public class SuperAdminController {
  private static final Set<String> ORGANIZATION_STATUSES = Set.of("ACTIVE", "TRIAL", "SUSPENDED", "CANCELLED");
  private static final Set<String> SUBSCRIPTION_STATUSES = Set.of("ACTIVE", "TRIAL", "PAST_DUE", "CANCELLED", "EXPIRED");

  private final OrganizationRepository organizationRepository;
  private final PlanRepository planRepository;
  private final SubscriptionRepository subscriptionRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final RoleRepository roleRepository;
  private final PasswordPolicy passwordPolicy;

  public SuperAdminController(OrganizationRepository organizationRepository, PlanRepository planRepository, SubscriptionRepository subscriptionRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository, PasswordPolicy passwordPolicy) {
    this.organizationRepository = organizationRepository;
    this.planRepository = planRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.roleRepository = roleRepository;
    this.passwordPolicy = passwordPolicy;
  }

  // Organizations / Tenants
  @GetMapping("/organizations")
  public ResponseEntity<List<Organization>> listOrganizations() {
    return ResponseEntity.ok(organizationRepository.findAll());
  }

  @PostMapping("/organizations")
  @Transactional
  public ResponseEntity<?> createOrganization(@RequestBody CreateOrganizationRequest req) {
    if (req.slug() == null || !req.slug().matches("[a-z0-9][a-z0-9-]{2,62}")) {
      return ResponseEntity.badRequest().body("El slug debe tener entre 3 y 63 caracteres: letras minúsculas, números o guiones");
    }
    if (req.name() == null || req.name().isBlank() || req.planId() == null) {
      return ResponseEntity.badRequest().body("Nombre y plan son obligatorios");
    }
    String requestedStatus = req.status() == null ? "TRIAL" : req.status().toUpperCase();
    if (!ORGANIZATION_STATUSES.contains(requestedStatus)) {
      return ResponseEntity.badRequest().body("Estado de organización inválido");
    }
    if ((req.maxUsers() != null && req.maxUsers() <= 0)
        || (req.maxUnits() != null && req.maxUnits() <= 0)) {
      return ResponseEntity.badRequest().body("Los límites del plan deben ser mayores que cero");
    }
    Plan selectedPlan = planRepository.findById(req.planId()).orElse(null);
    if (selectedPlan == null || !Boolean.TRUE.equals(selectedPlan.getActive())) {
      return ResponseEntity.badRequest().body("El plan seleccionado no está activo");
    }
    if (organizationRepository.existsBySlug(req.slug())) {
      return ResponseEntity.status(409).body("El slug ya existe");
    }
    if (req.adminUsername() == null || req.adminUsername().isBlank()
        || req.adminPassword() == null || req.adminPassword().isBlank()) {
      return ResponseEntity.badRequest().body("El usuario y la contraseña del administrador son obligatorios");
    }
    if (userRepository.existsByUsername(req.adminUsername())) {
      return ResponseEntity.status(409).body("El usuario administrador ya existe");
    }
    PasswordPolicy.PasswordValidationResult passwordValidation = passwordPolicy.validate(req.adminPassword());
    if (!passwordValidation.valid()) {
      return ResponseEntity.badRequest().body("Contraseña débil: " + String.join(", ", passwordValidation.errors()));
    }
    Organization org = new Organization();
    org.setSlug(req.slug());
    org.setName(req.name());
    org.setNit(req.nit());
    org.setAddress(req.address());
    org.setPhone(req.phone());
    org.setLogoUrl(req.logoUrl());
    org.setPrimaryColor(req.primaryColor());
    org.setStatus(requestedStatus);
    org.setPlanId(req.planId());
    org.setMaxUsers(req.maxUsers() != null ? req.maxUsers() : selectedPlan.getMaxUsers());
    org.setMaxUnits(req.maxUnits() != null ? req.maxUnits() : selectedPlan.getMaxUnits());
    org.setTrialEndsAt(LocalDateTime.now().plusDays(15));
    org = organizationRepository.save(org);

    // Create admin user for the tenant
    if (req.adminUsername() != null && !req.adminUsername().isBlank()) {
      User admin = new User();
      admin.setUsername(req.adminUsername());
      admin.setPassword(passwordEncoder.encode(req.adminPassword()));
      admin.setRole("ADMIN");
      admin.setEmail(req.adminEmail());
      admin.setFullName(req.adminFullName());
      admin.setActive(true);
      admin.setOrganizationId(org.getId());
      userRepository.save(admin);
    }

    // Create initial subscription
    Subscription sub = new Subscription();
    sub.setOrganizationId(org.getId());
    sub.setPlanId(org.getPlanId());
    sub.setStatus(org.getStatus());
    sub.setStartDate(LocalDate.now());
    sub.setTrialEndsAt(LocalDate.now().plusDays(15));
    sub.setBillingPeriod("MONTHLY");
    subscriptionRepository.save(sub);

    return ResponseEntity.ok(org);
  }

  @PutMapping("/organizations/{id}")
  @Transactional
  public ResponseEntity<?> updateOrganization(@PathVariable Long id, @RequestBody CreateOrganizationRequest req) {
    if (req.status() != null && !ORGANIZATION_STATUSES.contains(req.status().toUpperCase())) {
      return ResponseEntity.badRequest().body("Estado de organización inválido");
    }
    if ((req.maxUsers() != null && req.maxUsers() <= 0)
        || (req.maxUnits() != null && req.maxUnits() <= 0)) {
      return ResponseEntity.badRequest().body("Los límites del plan deben ser mayores que cero");
    }
    Optional<Organization> opt = organizationRepository.findById(id);
    if (opt.isEmpty()) return ResponseEntity.status(404).body("Organización no encontrada");
    Organization org = opt.get();
    if (req.name() != null) org.setName(req.name());
    if (req.status() != null) org.setStatus(req.status().toUpperCase());
    if (req.planId() != null) {
      Plan plan = planRepository.findById(req.planId()).orElse(null);
      if (plan == null || !Boolean.TRUE.equals(plan.getActive())) {
        return ResponseEntity.badRequest().body("El plan seleccionado no está activo");
      }
      org.setPlanId(req.planId());
      if (req.maxUsers() == null) org.setMaxUsers(plan.getMaxUsers());
      if (req.maxUnits() == null) org.setMaxUnits(plan.getMaxUnits());
      subscriptionRepository.findByOrganizationId(id).ifPresent(subscription -> {
        subscription.setPlanId(plan.getId());
        subscriptionRepository.save(subscription);
      });
    }
    if (req.primaryColor() != null) org.setPrimaryColor(req.primaryColor());
    if (req.logoUrl() != null) org.setLogoUrl(req.logoUrl());
    if (req.maxUsers() != null) org.setMaxUsers(req.maxUsers());
    if (req.maxUnits() != null) org.setMaxUnits(req.maxUnits());
    return ResponseEntity.ok(organizationRepository.save(org));
  }

  // Plans
  @GetMapping("/plans")
  public ResponseEntity<List<Plan>> listPlans() {
    return ResponseEntity.ok(planRepository.findAll());
  }

  @PostMapping("/plans")
  public ResponseEntity<?> createPlan(@RequestBody Plan plan) {
    String validationError = validatePlan(plan);
    if (validationError != null) return ResponseEntity.badRequest().body(validationError);
    String code = plan.getCode().trim().toUpperCase();
    if (planRepository.existsByCode(code)) {
      return ResponseEntity.status(409).body("El código del plan ya existe");
    }
    plan.setId(null);
    plan.setCode(code);
    return ResponseEntity.ok(planRepository.save(plan));
  }

  @PutMapping("/plans/{id}")
  public ResponseEntity<?> updatePlan(@PathVariable Long id, @RequestBody Plan plan) {
    String validationError = validatePlan(plan);
    if (validationError != null) return ResponseEntity.badRequest().body(validationError);
    return planRepository.findById(id)
      .map(existing -> {
        String code = plan.getCode().trim().toUpperCase();
        Plan withSameCode = planRepository.findByCode(code).orElse(null);
        if (withSameCode != null && !id.equals(withSameCode.getId())) {
          return ResponseEntity.status(409).body("El código del plan ya existe");
        }
        existing.setCode(code);
        existing.setName(plan.getName());
        existing.setDescription(plan.getDescription());
        existing.setPrice(plan.getPrice());
        existing.setBillingPeriod(plan.getBillingPeriod().toUpperCase());
        existing.setModules(plan.getModules());
        existing.setMaxUsers(plan.getMaxUsers());
        existing.setMaxUnits(plan.getMaxUnits());
        existing.setActive(plan.getActive());
        return ResponseEntity.ok(planRepository.save(existing));
      })
      .orElseGet(() -> ResponseEntity.notFound().build());
  }

  // Subscriptions
  @GetMapping("/subscriptions")
  public ResponseEntity<List<Subscription>> listSubscriptions() {
    return ResponseEntity.ok(subscriptionRepository.findAll());
  }

  @PutMapping("/subscriptions/{id}")
  @Transactional
  public ResponseEntity<?> updateSubscription(@PathVariable Long id, @RequestBody UpdateSubscriptionRequest req) {
    if (req.status() != null && !SUBSCRIPTION_STATUSES.contains(req.status().toUpperCase())) {
      return ResponseEntity.badRequest().body("Estado de suscripción inválido");
    }
    if (req.billingPeriod() != null
        && !Set.of("MONTHLY", "YEARLY").contains(req.billingPeriod().toUpperCase())) {
      return ResponseEntity.badRequest().body("Periodo de facturación inválido");
    }
    return subscriptionRepository.findById(id)
      .map(subscription -> {
        if (req.planId() != null) {
          Plan plan = planRepository.findById(req.planId()).orElse(null);
          if (plan == null || !Boolean.TRUE.equals(plan.getActive())) {
            return ResponseEntity.badRequest().body("El plan seleccionado no está activo");
          }
          subscription.setPlanId(req.planId());
          organizationRepository.findById(subscription.getOrganizationId()).ifPresent(org -> {
            org.setPlanId(plan.getId());
            org.setMaxUsers(plan.getMaxUsers());
            org.setMaxUnits(plan.getMaxUnits());
            organizationRepository.save(org);
          });
        }
        if (req.status() != null) subscription.setStatus(req.status().toUpperCase());
        if (req.billingPeriod() != null) subscription.setBillingPeriod(req.billingPeriod().toUpperCase());
        if (req.endDate() != null) subscription.setEndDate(req.endDate());
        if (req.trialEndsAt() != null) subscription.setTrialEndsAt(req.trialEndsAt());
        return ResponseEntity.ok(subscriptionRepository.save(subscription));
      })
      .orElseGet(() -> ResponseEntity.notFound().build());
  }

  // Stats
  @GetMapping("/stats")
  public ResponseEntity<?> stats() {
    return ResponseEntity.ok(java.util.Map.of(
      "organizations", organizationRepository.count(),
      "plans", planRepository.count(),
      "subscriptions", subscriptionRepository.count(),
      "users", userRepository.count()
    ));
  }

  public record CreateOrganizationRequest(String slug, String name, String nit, String address, String phone,
                                          String logoUrl, String primaryColor, String status, Long planId,
                                          Integer maxUsers, Integer maxUnits,
                                          String adminUsername, String adminPassword,
                                          String adminEmail, String adminFullName) {}
  public record UpdateSubscriptionRequest(Long planId, String status, String billingPeriod,
                                          LocalDate endDate, LocalDate trialEndsAt) {}

  private String validatePlan(Plan plan) {
    if (plan.getCode() == null || !plan.getCode().trim().matches("[A-Za-z0-9_-]{2,30}")) {
      return "Código de plan inválido";
    }
    if (plan.getName() == null || plan.getName().isBlank() || plan.getModules() == null || plan.getModules().isBlank()) {
      return "Nombre y módulos son obligatorios";
    }
    if (plan.getPrice() == null || plan.getPrice().signum() < 0
        || plan.getMaxUsers() == null || plan.getMaxUsers() <= 0
        || plan.getMaxUnits() == null || plan.getMaxUnits() <= 0) {
      return "Precio y límites del plan son inválidos";
    }
    if (plan.getBillingPeriod() == null || !Set.of("MONTHLY", "YEARLY").contains(plan.getBillingPeriod().toUpperCase())) {
      return "Periodo de facturación inválido";
    }
    if (plan.getActive() == null) plan.setActive(true);
    plan.setBillingPeriod(plan.getBillingPeriod().toUpperCase());
    return null;
  }
}
