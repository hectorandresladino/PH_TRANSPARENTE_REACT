package com.phtransparente.api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final OrganizationRepository organizationRepository;
  private final PlanRepository planRepository;
  private final SubscriptionRepository subscriptionRepository;
  private final PasswordEncoder passwordEncoder;

  public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, OrganizationRepository organizationRepository, PlanRepository planRepository, SubscriptionRepository subscriptionRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.organizationRepository = organizationRepository;
    this.planRepository = planRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * Crea o actualiza un usuario semilla. La contraseña (encriptada con BCrypt)
   * solo se asigna cuando el usuario es nuevo, para no sobrescribir en cada arranque
   * contraseñas que el usuario pudo haber cambiado.
   */
  private void upsertUser(String username, String rawPassword, String role, String email, String fullName, String phone) {
    User existing = userRepository.findByUsername(username);
    User user = (existing != null) ? existing : new User();
    if (existing == null) {
      user.setUsername(username);
      user.setPassword(passwordEncoder.encode(rawPassword));
    }
    user.setRole(role);
    user.setEmail(email);
    user.setFullName(fullName);
    user.setPhone(phone);
    user.setActive(true);
    userRepository.save(user);
  }

  private void migrateRoleModules(String roleName, String[] modulesToAdd) {
    roleRepository.findByName(roleName).ifPresent(role -> {
      boolean updated = false;
      for (String mod : modulesToAdd) {
        if (!role.getModules().contains(mod)) {
          role.setModules(role.getModules() + "," + mod);
          updated = true;
        }
      }
      if (updated) {
        roleRepository.save(role);
        System.out.println("Rol " + roleName + " actualizado con módulos faltantes");
      }
    });
  }

  @Override
  public void run(String... args) {
    // Crear roles específicos con módulos y contraseñas
    if (roleRepository.count() == 0) {
      // ADMINISTRADOR - Acceso total a todos los módulos
      roleRepository.save(new Role("ADMIN", "Administrador del sistema con acceso total", 
        "dashboard,users,pqr,pqr-statistics,payment-reports,payments,reservations,visitors,contracts,fines,documents,assemblies,votes,councils,security,contractors,property-units,reserve-funds,annual-budgets,insurance-policies,bank-accounts,official-minutes,council-minutes,accounting-reports,fiscal-reports,horizontal-property-regulations,alerts,transparency,authorizations,reports,personnel-ratings,support-tasks,task-statistics,staff-info,staff-ratings,appstore", 
        "admin123"));
      
      // CONTADOR - Módulos financieros y legales + reportes + calificaciones
      roleRepository.save(new Role("CONTADOR", "Contador con acceso a módulos financieros", 
        "dashboard,accounting-reports,payment-reports,payments,bank-accounts,reserve-funds,annual-budgets,fines,contracts,council-minutes,fiscal-reports,reports,documents,transparency,staff-info,staff-ratings", 
        "contador123"));
      
      // REVISOR FISCAL - Módulos de auditoría y legales + reportes + calificaciones
      roleRepository.save(new Role("REVISOR_FISCAL", "Revisor Fiscal con acceso a auditoría y legales", 
        "dashboard,fiscal-reports,payments,bank-accounts,reserve-funds,annual-budgets,contracts,council-minutes,accounting-reports,official-minutes,reports,documents,transparency,assemblies,task-statistics,staff-info,staff-ratings", 
        "revisor123"));
      
      // CONSEJEROS - Módulos de gestión y decisiones legales + reportes + calificaciones
      roleRepository.save(new Role("CONSEJERO", "Consejero con acceso a gestión y decisiones", 
        "dashboard,council-minutes,assemblies,votes,councils,documents,accounting-reports,fiscal-reports,security,contractors,property-units,annual-budgets,official-minutes,horizontal-property-regulations,alerts,reports,personnel-ratings,support-tasks,task-statistics,staff-ratings", 
        "consejero123"));
      
      // COPROPIETARIOS - Módulos básicos de residentes + transparencia + reportes + calificaciones + soporte
      roleRepository.save(new Role("COPROPIETARIO", "Copropietario con acceso a módulos básicos y transparencia", 
        "dashboard,pqr,pqr-statistics,reservations,visitors,payments,bank-accounts,council-minutes,accounting-reports,fiscal-reports,property-units,alerts,transparency,reports,personnel-ratings,support-tasks", 
        "copropietario123"));
      
      // EMPRESA DE VIGILANCIA - Módulos de seguridad
      roleRepository.save(new Role("VIGILANCIA", "Empresa de vigilancia con acceso a módulos de seguridad", 
        "dashboard,security-reports,security,visitors,alerts,reports,support-tasks,personnel-ratings", 
        "vigilancia123"));
      
      // EMPRESA DE ASEO - Módulos de limpieza
      roleRepository.save(new Role("ASEO", "Empresa de aseo con acceso a módulos de limpieza", 
        "dashboard,cleaning-tasks,support-tasks,reports,alerts,personnel-ratings,documents", 
        "aseo123"));
      
      System.out.println("Roles específicos creados");
    }

    // Migración: actualizar roles existentes con módulos faltantes
    migrateRoleModules("ADMIN", new String[]{
      "pqr-statistics","payment-reports","council-minutes","accounting-reports","fiscal-reports",
      "task-statistics","staff-info","staff-ratings"
    });
    migrateRoleModules("CONTADOR", new String[]{
      "accounting-reports","payment-reports","council-minutes","fiscal-reports","transparency","staff-info","staff-ratings"
    });
    migrateRoleModules("REVISOR_FISCAL", new String[]{
      "fiscal-reports","council-minutes","accounting-reports","transparency","task-statistics","staff-info","staff-ratings"
    });
    migrateRoleModules("CONSEJERO", new String[]{
      "council-minutes","accounting-reports","fiscal-reports","task-statistics","staff-ratings"
    });
    migrateRoleModules("COPROPIETARIO", new String[]{
      "pqr-statistics","council-minutes","accounting-reports","fiscal-reports"
    });
    migrateRoleModules("VIGILANCIA", new String[]{
      "security-reports","reports","support-tasks","personnel-ratings"
    });

    // Crear rol ASEO si no existe
    if (roleRepository.findByName("ASEO").isEmpty()) {
      roleRepository.save(new Role("ASEO", "Empresa de aseo con acceso a módulos de limpieza",
        "dashboard,cleaning-tasks,support-tasks,reports,alerts,personnel-ratings,documents",
        "aseo123"));
      System.out.println("Rol ASEO creado");
    }

    // Crear plan BÁSICO si no existe (para nuevos tenants)
    if (planRepository.count() == 0) {
      planRepository.save(new Plan("BASICO", "Básico", "Ideal para copropiedades pequeñas", java.math.BigDecimal.valueOf(99000),
        "MONTHLY",
        "dashboard,pqr,payments,reservations,visitors,property-units,alerts,reports,transparency",
        20, 30, true));
      planRepository.save(new Plan("PROFESIONAL", "Profesional", "Para administradores profesionales", java.math.BigDecimal.valueOf(249000),
        "MONTHLY",
        "dashboard,users,pqr,pqr-statistics,payments,reservations,visitors,contracts,fines,documents,assemblies,votes,councils,security,contractors,property-units,reserve-funds,annual-budgets,insurance-policies,bank-accounts,official-minutes,horizontal-property-regulations,alerts,transparency,authorizations,reports,personnel-ratings,support-tasks",
        100, 200, true));
      planRepository.save(new Plan("EMPRESARIAL", "Empresarial", "Multi-copropiedad y roles avanzados", java.math.BigDecimal.valueOf(499000),
        "MONTHLY",
        "dashboard,users,pqr,pqr-statistics,payment-reports,payments,reservations,visitors,contracts,fines,documents,assemblies,votes,councils,security,contractors,property-units,reserve-funds,annual-budgets,insurance-policies,bank-accounts,official-minutes,council-minutes,accounting-reports,fiscal-reports,horizontal-property-regulations,alerts,transparency,authorizations,reports,personnel-ratings,support-tasks,task-statistics,staff-info,staff-ratings",
        500, 1000, true));
      System.out.println("Planes iniciales creados");
    }

    // Crear organizacion DEMO si no existe y asignar usuarios legacy a ella
    Organization demo = organizationRepository.findBySlug("demo").orElse(null);
    if (demo == null) {
      Plan firstPlan = planRepository.findByCode("EMPRESARIAL").orElse(planRepository.findAll().get(0));
      demo = new Organization();
      demo.setSlug("demo");
      demo.setName("Copropiedad Demo");
      demo.setNit("900123456-7");
      demo.setStatus("ACTIVE");
      demo.setPlanId(firstPlan.getId());
      demo.setMaxUsers(firstPlan.getMaxUsers());
      demo.setMaxUnits(firstPlan.getMaxUnits());
      demo = organizationRepository.save(demo);

      Subscription sub = new Subscription();
      sub.setOrganizationId(demo.getId());
      sub.setPlanId(firstPlan.getId());
      sub.setStatus("ACTIVE");
      sub.setBillingPeriod("MONTHLY");
      subscriptionRepository.save(sub);
      System.out.println("Organizacion DEMO creada con plan " + firstPlan.getName());
    }

    // Asignar organizationId a usuarios legacy que no lo tengan
    for (User u : userRepository.findAll()) {
      if (u.getOrganizationId() == null || u.getOrganizationId() == 0L) {
        u.setOrganizationId(demo.getId());
        userRepository.save(u);
      }
    }

    // Crear superadmin de la plataforma
    upsertUser("superadmin", "superadmin123", "SUPERADMIN", "superadmin@phtransparente.com", "Super Administrador Plataforma", "+57 300 000 0000");
    User superAdmin = userRepository.findByUsername("superadmin");
    if (superAdmin != null) {
      superAdmin.setOrganizationId(0L);
      userRepository.save(superAdmin);
    }

    // Crear o actualizar usuarios semilla del tenant DEMO
    upsertUser("admin", "admin123", "ADMIN", "admin@phtransparente.com", "Administrador del Sistema", "+57 300 123 4567");
    setUserOrganization("admin", demo.getId());
    upsertUser("contador", "contador123", "CONTADOR", "contador@phtransparente.com", "Contador Principal", "+57 300 234 5678");
    setUserOrganization("contador", demo.getId());
    upsertUser("revisor", "revisor123", "REVISOR_FISCAL", "revisor@phtransparente.com", "Revisor Fiscal", "+57 300 345 6789");
    setUserOrganization("revisor", demo.getId());
    upsertUser("consejero", "consejero123", "CONSEJERO", "consejero@phtransparente.com", "Consejero Principal", "+57 300 456 7890");
    setUserOrganization("consejero", demo.getId());
    upsertUser("copropietario", "copropietario123", "COPROPIETARIO", "copropietario@phtransparente.com", "Copropietario Residente", "+57 300 567 8901");
    setUserOrganization("copropietario", demo.getId());
    upsertUser("vigilancia", "vigilancia123", "VIGILANCIA", "vigilancia@phtransparente.com", "Empresa de Vigilancia", "+57 300 678 9012");
    setUserOrganization("vigilancia", demo.getId());
    upsertUser("aseo", "aseo123", "ASEO", "aseo@phtransparente.com", "Empresa de Aseo", "+57 300 789 0123");
    setUserOrganization("aseo", demo.getId());
    
    System.out.println("Usuarios semilla verificados para cada rol");
  }

  private void setUserOrganization(String username, Long orgId) {
    User u = userRepository.findByUsername(username);
    if (u != null) {
      u.setOrganizationId(orgId);
      userRepository.save(u);
    }
  }
}
