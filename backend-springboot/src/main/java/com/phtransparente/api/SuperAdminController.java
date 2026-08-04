package com.phtransparente.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/superadmin")
@PreAuthorize("hasRole('SUPERADMIN')")
public class SuperAdminController {

  private final OrganizationRepository organizationRepository;
  private final PlanRepository planRepository;
  private final SubscriptionRepository subscriptionRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final RoleRepository roleRepository;

  public SuperAdminController(OrganizationRepository organizationRepository, PlanRepository planRepository, SubscriptionRepository subscriptionRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
    this.organizationRepository = organizationRepository;
    this.planRepository = planRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.roleRepository = roleRepository;
  }

  // Organizations / Tenants
  @GetMapping("/organizations")
  public ResponseEntity<List<Organization>> listOrganizations() {
    return ResponseEntity.ok(organizationRepository.findAll());
  }

  @PostMapping("/organizations")
  public ResponseEntity<?> createOrganization(@RequestBody CreateOrganizationRequest req) {
    if (organizationRepository.existsBySlug(req.slug())) {
      return ResponseEntity.status(409).body("El slug ya existe");
    }
    Organization org = new Organization();
    org.setSlug(req.slug());
    org.setName(req.name());
    org.setNit(req.nit());
    org.setAddress(req.address());
    org.setPhone(req.phone());
    org.setLogoUrl(req.logoUrl());
    org.setPrimaryColor(req.primaryColor());
    org.setStatus(req.status() != null ? req.status() : "TRIAL");
    org.setPlanId(req.planId());
    org.setMaxUsers(req.maxUsers());
    org.setMaxUsers(req.maxUnits());
    org.setTrialEndsAt(LocalDateTime.now().plusDays(15));
    org = organizationRepository.save(org);

    // Create admin user for the tenant
    if (req.adminUsername() != null && !req.adminUsername().isBlank()) {
      User admin = new User();
      admin.setUsername(req.adminUsername());
      admin.setPassword(passwordEncoder.encode(req.adminPassword() != null ? req.adminPassword() : "admin123"));
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
    sub.setTrialEndsAt(LocalDate.now().plusDays(15));
    sub.setBillingPeriod("MONTHLY");
    subscriptionRepository.save(sub);

    return ResponseEntity.ok(org);
  }

  @PutMapping("/organizations/{id}")
  public ResponseEntity<?> updateOrganization(@PathVariable Long id, @RequestBody CreateOrganizationRequest req) {
    Optional<Organization> opt = organizationRepository.findById(id);
    if (opt.isEmpty()) return ResponseEntity.status(404).body("Organización no encontrada");
    Organization org = opt.get();
    if (req.name() != null) org.setName(req.name());
    if (req.status() != null) org.setStatus(req.status());
    if (req.planId() != null) org.setPlanId(req.planId());
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
  public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) {
    return ResponseEntity.ok(planRepository.save(plan));
  }

  @PutMapping("/plans/{id}")
  public ResponseEntity<Plan> updatePlan(@PathVariable Long id, @RequestBody Plan plan) {
    plan.setId(id);
    return ResponseEntity.ok(planRepository.save(plan));
  }

  // Subscriptions
  @GetMapping("/subscriptions")
  public ResponseEntity<List<Subscription>> listSubscriptions() {
    return ResponseEntity.ok(subscriptionRepository.findAll());
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
}
