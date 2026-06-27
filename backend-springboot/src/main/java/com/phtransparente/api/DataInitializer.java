package com.phtransparente.api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;

  public DataInitializer(UserRepository userRepository, RoleRepository roleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  @Override
  public void run(String... args) {
    // Crear roles específicos con módulos y contraseñas
    if (roleRepository.count() == 0) {
      // ADMINISTRADOR - Acceso total a todos los módulos
      roleRepository.save(new Role("ADMIN", "Administrador del sistema con acceso total", 
        "dashboard,users,pqr,payments,reservations,visitors,contracts,fines,documents,assemblies,votes,councils,security,contractors,property-units,reserve-funds,annual-budgets,insurance-policies,bank-accounts,official-minutes,horizontal-property-regulations,alerts,transparency,authorizations,reports,personnel-ratings,support-tasks,appstore", 
        "admin123"));
      
      // CONTADOR - Módulos financieros y legales + reportes + calificaciones
      roleRepository.save(new Role("CONTADOR", "Contador con acceso a módulos financieros", 
        "dashboard,payments,contracts,fines,documents,contractors,property-units,reserve-funds,annual-budgets,bank-accounts,alerts,reports,personnel-ratings,support-tasks", 
        "contador123"));
      
      // REVISOR FISCAL - Módulos de auditoría y legales + reportes + calificaciones
      roleRepository.save(new Role("REVISOR_FISCAL", "Revisor Fiscal con acceso a auditoría y legales", 
        "dashboard,payments,contracts,fines,documents,assemblies,votes,contractors,property-units,reserve-funds,annual-budgets,bank-accounts,official-minutes,alerts,reports,personnel-ratings,support-tasks", 
        "revisor123"));
      
      // CONSEJEROS - Módulos de gestión y decisiones legales + reportes + calificaciones
      roleRepository.save(new Role("CONSEJERO", "Consejero con acceso a gestión y decisiones", 
        "dashboard,assemblies,votes,councils,documents,security,contractors,property-units,annual-budgets,official-minutes,horizontal-property-regulations,alerts,reports,personnel-ratings,support-tasks", 
        "consejero123"));
      
      // COPROPIETARIOS - Módulos básicos de residentes + transparencia + reportes + calificaciones + soporte
      roleRepository.save(new Role("COPROPIETARIO", "Copropietario con acceso a módulos básicos y transparencia", 
        "dashboard,pqr,reservations,visitors,documents,payments,property-units,alerts,transparency,reports,personnel-ratings,support-tasks", 
        "copropietario123"));
      
      // EMPRESA DE VIGILANCIA - Módulos de seguridad
      roleRepository.save(new Role("VIGILANCIA", "Empresa de vigilancia con acceso a módulos de seguridad", 
        "dashboard,security,visitors,property-units,alerts", 
        "vigilancia123"));
      
      System.out.println("Roles específicos creados");
    }

    // Crear o actualizar usuarios (asegura que siempre tengan los datos correctos)
    User admin = userRepository.findByUsername("admin");
    if (admin == null) admin = new User();
    admin.setUsername("admin");
    admin.setPassword("admin123");
    admin.setRole("ADMIN");
    admin.setEmail("admin@phtransparente.com");
    admin.setFullName("Administrador del Sistema");
    admin.setPhone("+57 300 123 4567");
    admin.setActive(true);
    userRepository.save(admin);
    
    User contador = userRepository.findByUsername("contador");
    if (contador == null) contador = new User();
    contador.setUsername("contador");
    contador.setPassword("contador123");
    contador.setRole("CONTADOR");
    contador.setEmail("contador@phtransparente.com");
    contador.setFullName("Contador Principal");
    contador.setPhone("+57 300 234 5678");
    contador.setActive(true);
    userRepository.save(contador);
    
    User revisor = userRepository.findByUsername("revisor");
    if (revisor == null) revisor = new User();
    revisor.setUsername("revisor");
    revisor.setPassword("revisor123");
    revisor.setRole("REVISOR_FISCAL");
    revisor.setEmail("revisor@phtransparente.com");
    revisor.setFullName("Revisor Fiscal");
    revisor.setPhone("+57 300 345 6789");
    revisor.setActive(true);
    userRepository.save(revisor);
    
    User consejero = userRepository.findByUsername("consejero");
    if (consejero == null) consejero = new User();
    consejero.setUsername("consejero");
    consejero.setPassword("consejero123");
    consejero.setRole("CONSEJERO");
    consejero.setEmail("consejero@phtransparente.com");
    consejero.setFullName("Consejero Principal");
    consejero.setPhone("+57 300 456 7890");
    consejero.setActive(true);
    userRepository.save(consejero);
    
    User copropietario = userRepository.findByUsername("copropietario");
    if (copropietario == null) copropietario = new User();
    copropietario.setUsername("copropietario");
    copropietario.setPassword("copropietario123");
    copropietario.setRole("COPROPIETARIO");
    copropietario.setEmail("copropietario@phtransparente.com");
    copropietario.setFullName("Copropietario Residente");
    copropietario.setPhone("+57 300 567 8901");
    copropietario.setActive(true);
    userRepository.save(copropietario);
    
    User vigilancia = userRepository.findByUsername("vigilancia");
    if (vigilancia == null) vigilancia = new User();
    vigilancia.setUsername("vigilancia");
    vigilancia.setPassword("vigilancia123");
    vigilancia.setRole("VIGILANCIA");
    vigilancia.setEmail("vigilancia@phtransparente.com");
    vigilancia.setFullName("Empresa de Vigilancia");
    vigilancia.setPhone("+57 300 678 9012");
    vigilancia.setActive(true);
    userRepository.save(vigilancia);
    
    System.out.println("Usuarios actualizados para cada rol");
  }
}
