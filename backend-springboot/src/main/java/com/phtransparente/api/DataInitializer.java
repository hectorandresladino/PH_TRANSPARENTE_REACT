package com.phtransparente.api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;

  public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
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

    // Crear o actualizar usuarios semilla (la contraseña solo se asigna al crearlos)
    upsertUser("admin", "admin123", "ADMIN", "admin@phtransparente.com", "Administrador del Sistema", "+57 300 123 4567");
    upsertUser("contador", "contador123", "CONTADOR", "contador@phtransparente.com", "Contador Principal", "+57 300 234 5678");
    upsertUser("revisor", "revisor123", "REVISOR_FISCAL", "revisor@phtransparente.com", "Revisor Fiscal", "+57 300 345 6789");
    upsertUser("consejero", "consejero123", "CONSEJERO", "consejero@phtransparente.com", "Consejero Principal", "+57 300 456 7890");
    upsertUser("copropietario", "copropietario123", "COPROPIETARIO", "copropietario@phtransparente.com", "Copropietario Residente", "+57 300 567 8901");
    upsertUser("vigilancia", "vigilancia123", "VIGILANCIA", "vigilancia@phtransparente.com", "Empresa de Vigilancia", "+57 300 678 9012");
    upsertUser("aseo", "aseo123", "ASEO", "aseo@phtransparente.com", "Empresa de Aseo", "+57 300 789 0123");
    
    System.out.println("Usuarios semilla verificados para cada rol");
  }
}
