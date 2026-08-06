package com.phtransparente.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;

/**
 * Aprovisiona el primer superadministrador sin incluir credenciales por defecto.
 * Solo actua cuando APP_BOOTSTRAP_SUPERADMIN_PASSWORD esta configurada.
 */
@Component
@Order(100)
public class PlatformBootstrap implements CommandLineRunner {
  private static final Logger logger = LoggerFactory.getLogger(PlatformBootstrap.class);

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final PasswordPolicy passwordPolicy;
  private final String username;
  private final String password;
  private final String email;

  public PlatformBootstrap(UserRepository userRepository, RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder, PasswordPolicy passwordPolicy,
                           @Value("${app.bootstrap.superadmin.username:superadmin}") String username,
                           @Value("${app.bootstrap.superadmin.password:}") String password,
                           @Value("${app.bootstrap.superadmin.email:}") String email) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
    this.passwordPolicy = passwordPolicy;
    this.username = username;
    this.password = password;
    this.email = email;
  }

  @Override
  public void run(String... args) {
    if (roleRepository.findByName("SUPERADMIN").isEmpty()) {
      roleRepository.save(new Role("SUPERADMIN", "Administrador de la plataforma SaaS", ""));
    }
    if (password == null || password.isBlank() || userRepository.findByUsername(username) != null) {
      return;
    }
    PasswordPolicy.PasswordValidationResult validation = passwordPolicy.validate(password);
    if (!validation.valid()) {
      throw new IllegalStateException(
        "APP_BOOTSTRAP_SUPERADMIN_PASSWORD no cumple la politica: " + String.join(", ", validation.errors()));
    }
    User user = new User();
    user.setUsername(username);
    user.setPassword(passwordEncoder.encode(password));
    user.setRole("SUPERADMIN");
    user.setEmail(email);
    user.setFullName("Superadministrador de plataforma");
    user.setActive(true);
    user.setOrganizationId(0L);
    userRepository.save(user);
    logger.info("Superadministrador inicial creado: {}. Retire la variable de bootstrap.", username);
  }
}
