package com.phtransparente.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final OrganizationRepository organizationRepository;
  private final VerificationService verificationService;
  private final PasswordEncoder passwordEncoder;
  private final LoginRateLimiter loginRateLimiter;
  private final JwtUtil jwtUtil;
  private final AuditLogService auditLogService;
  private final PasswordPolicy passwordPolicy;
  private final SaasAccessService saasAccessService;
  private final boolean selfRegistrationEnabled;

  public AuthController(UserRepository userRepository, RoleRepository roleRepository, OrganizationRepository organizationRepository, VerificationService verificationService, PasswordEncoder passwordEncoder, LoginRateLimiter loginRateLimiter, JwtUtil jwtUtil, AuditLogService auditLogService, PasswordPolicy passwordPolicy, SaasAccessService saasAccessService,
                        @Value("${app.saas.self-registration-enabled:false}") boolean selfRegistrationEnabled) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.organizationRepository = organizationRepository;
    this.verificationService = verificationService;
    this.passwordEncoder = passwordEncoder;
    this.loginRateLimiter = loginRateLimiter;
    this.jwtUtil = jwtUtil;
    this.auditLogService = auditLogService;
    this.passwordPolicy = passwordPolicy;
    this.saasAccessService = saasAccessService;
    this.selfRegistrationEnabled = selfRegistrationEnabled;
  }

  private static boolean isBCryptHash(String value) {
    return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
    logger.info("Intento de login para usuario: {}", request.username());

    if (loginRateLimiter.isBlocked(request.username())) {
      long seconds = loginRateLimiter.secondsUntilUnlock(request.username());
      logger.warn("Login bloqueado por demasiados intentos: {} ({}s restantes)", request.username(), seconds);
      return ResponseEntity.status(429).body(
        "Demasiados intentos fallidos. Intenta de nuevo en " + Math.ceil(seconds / 60.0) + " minuto(s).");
    }

    User user = userRepository.findByUsername(request.username());

    if (user == null) {
      loginRateLimiter.recordFailure(request.username());
      auditLogService.logForOrganization("LOGIN_FAILED", request.username(), "UNKNOWN", "Usuario no existe", null, null, httpRequest, "FAIL", 0L);
      logger.warn("Login fallido para usuario: {}", request.username());
      return ResponseEntity.status(401).body("Credenciales inválidas");
    }

    boolean passwordMatches;
    if (isBCryptHash(user.getPassword())) {
      passwordMatches = passwordEncoder.matches(request.password(), user.getPassword());
    } else {
      // Contraseña heredada en texto plano: comparar y, si coincide, migrar a hash
      passwordMatches = user.getPassword() != null && user.getPassword().equals(request.password());
      if (passwordMatches) {
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);
        logger.info("Contraseña migrada a hash para usuario: {}", request.username());
      }
    }

    if (passwordMatches) {
      if (Boolean.FALSE.equals(user.getActive())) {
        auditLogService.logForOrganization("LOGIN_BLOCKED", user.getUsername(), user.getRole(), "Usuario inactivo intentó iniciar sesión", null, null, httpRequest, "BLOCKED", user.getOrganizationId());
        logger.warn("Login rechazado (usuario inactivo): {}", request.username());
        return ResponseEntity.status(403).body("La cuenta está inactiva");
      }
      // Validar organización/tenant
      Organization org = organizationRepository.findById(user.getOrganizationId()).orElse(null);
      String orgSlug = org != null ? org.getSlug() : "ph";
      SaasAccessService.AccessDecision access = saasAccessService.validateAccess(user.getOrganizationId(), user.getRole());
      if (!access.allowed()) {
        auditLogService.logForOrganization("LOGIN_BLOCKED", user.getUsername(), user.getRole(), access.message(), null, null, httpRequest, "BLOCKED", user.getOrganizationId());
        return ResponseEntity.status(403).body(access.message());
      }

      Role role = roleRepository.findByName(user.getRole()).orElse(null);
      String modules = saasAccessService.effectiveModules(
        user.getOrganizationId(), role != null ? role.getModules() : "");
      String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getOrganizationId(), orgSlug);
      loginRateLimiter.reset(request.username());
      auditLogService.logForOrganization("LOGIN_SUCCESS", user.getUsername(), user.getRole(), "Inicio de sesión exitoso", null, null, httpRequest, "SUCCESS", user.getOrganizationId());
      logger.info("Login exitoso para usuario: {}", request.username());
      return ResponseEntity.ok(new LoginResponse(user.getId(), user.getUsername(), user.getRole(), modules, token, user.getOrganizationId(), orgSlug, org != null ? org.getName() : "PH Transparente"));
    }

    loginRateLimiter.recordFailure(request.username());
    auditLogService.logForOrganization("LOGIN_FAILED", request.username(), user.getRole(), "Contraseña incorrecta", null, null, httpRequest, "FAIL", user.getOrganizationId());
    logger.warn("Login fallido para usuario: {}", request.username());
    return ResponseEntity.status(401).body("Credenciales inválidas");
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
    if (!selfRegistrationEnabled) {
      return ResponseEntity.status(403).body("El registro público está deshabilitado. Solicita una invitación al administrador.");
    }
    if (request.password() == null || !request.password().equals(request.confirmPassword())) {
      return ResponseEntity.badRequest().body("Las contraseñas no coinciden");
    }
    if (request.organizationSlug() == null || request.organizationSlug().isBlank()) {
      return ResponseEntity.badRequest().body("El código de la organización es obligatorio");
    }
    User existingUser = userRepository.findByUsername(request.username());
    
    if (existingUser != null) {
      auditLogService.logForOrganization("REGISTER_FAILED", request.username(), "COPROPIETARIO", "Intento de registro con usuario existente", null, null, httpRequest, "FAIL", existingUser.getOrganizationId());
      return ResponseEntity.status(400).body("El usuario ya existe");
    }

    PasswordPolicy.PasswordValidationResult validation = passwordPolicy.validate(request.password());
    if (!validation.valid()) {
      return ResponseEntity.status(400).body("Contraseña débil: " + String.join(", ", validation.errors()));
    }
    
    Organization organization = organizationRepository.findBySlug(request.organizationSlug().trim().toLowerCase()).orElse(null);
    if (organization == null) {
      return ResponseEntity.badRequest().body("La organización no existe");
    }
    SaasAccessService.AccessDecision access = saasAccessService.validateAccess(organization.getId(), "COPROPIETARIO");
    if (!access.allowed()) {
      return ResponseEntity.status(403).body(access.message());
    }
    if (saasAccessService.hasReachedUserLimit(organization.getId())) {
      return ResponseEntity.status(409).body("La organización alcanzó el límite de usuarios de su plan");
    }

    User newUser = new User();
    newUser.setUsername(request.username());
    newUser.setPassword(passwordEncoder.encode(request.password()));
    newUser.setRole("COPROPIETARIO");
    newUser.setEmail(request.email());
    newUser.setActive(true);

    newUser.setOrganizationId(organization.getId());
    
    User savedUser = userRepository.save(newUser);
    auditLogService.logForOrganization("REGISTER_SUCCESS", savedUser.getUsername(), savedUser.getRole(), "Nuevo usuario registrado", "USER", savedUser.getId(), httpRequest, "SUCCESS", savedUser.getOrganizationId());

    // Obtener módulos del rol
    Role role = roleRepository.findByName(savedUser.getRole()).orElse(null);
    String modules = saasAccessService.effectiveModules(
      organization.getId(), role != null ? role.getModules() : "");
    String orgSlug = organization.getSlug();
    String orgName = organization.getName();
    String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getRole(), savedUser.getOrganizationId(), orgSlug);

    return ResponseEntity.ok(new LoginResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getRole(), modules, token, savedUser.getOrganizationId(), orgSlug, orgName));
  }

  @GetMapping("/me")
  public ResponseEntity<?> currentUser(org.springframework.security.core.Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      return ResponseEntity.status(401).body("No autenticado");
    }
    String username = authentication.getName();
    User user = userRepository.findByUsername(username);
    if (user == null) {
      return ResponseEntity.status(404).body("Usuario no encontrado");
    }
    Role role = roleRepository.findByName(user.getRole()).orElse(null);
    String modules = saasAccessService.effectiveModules(
      user.getOrganizationId(), role != null ? role.getModules() : "");
    Organization org = organizationRepository.findById(user.getOrganizationId()).orElse(null);
    String orgSlug = org != null ? org.getSlug() : "ph";
    String orgName = org != null ? org.getName() : "PH Transparente";
    return ResponseEntity.ok(new LoginResponse(user.getId(), user.getUsername(), user.getRole(), modules, null, user.getOrganizationId(), orgSlug, orgName));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    User user = userRepository.findByUsername(request.username());
    
    // Respuesta genérica para no revelar si el usuario existe (evita enumeración de usuarios)
    // y nunca se expone la contraseña.
    if (user == null) {
      logger.warn("forgot-password solicitado para usuario inexistente: {}", request.username());
    } else {
      try {
        verificationService.createAndSendVerificationCode(request.username());
      } catch (RuntimeException ex) {
        logger.warn("No fue posible enviar recuperación para {}: {}", request.username(), ex.getMessage());
      }
    }
    return ResponseEntity.ok(new ForgotPasswordResponse(
      "Si la cuenta existe, se enviarán instrucciones de recuperación al correo registrado."));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
    String limiterKey = "password-reset:" + request.username();
    if (loginRateLimiter.isBlocked(limiterKey)) {
      return ResponseEntity.status(429).body("Demasiados intentos. Intenta nuevamente más tarde.");
    }
    User user = userRepository.findByUsername(request.username());
    
    if (user == null) {
      loginRateLimiter.recordFailure(limiterKey);
      return ResponseEntity.status(400).body("Código inválido o expirado");
    }
    if (request.code() == null || !verificationService.verifyCode(request.username(), request.code())) {
      loginRateLimiter.recordFailure(limiterKey);
      return ResponseEntity.status(400).body("Código inválido o expirado");
    }

    PasswordPolicy.PasswordValidationResult validation = passwordPolicy.validate(request.newPassword());
    if (!validation.valid()) {
      return ResponseEntity.status(400).body("Contraseña débil: " + String.join(", ", validation.errors()));
    }
    
    user.setPassword(passwordEncoder.encode(request.newPassword()));
    userRepository.save(user);
    loginRateLimiter.reset(limiterKey);
    
    return ResponseEntity.ok("Contraseña actualizada exitosamente");
  }

  public record LoginRequest(String username, String password) {}
  public record LoginResponse(Long id, String username, String role, String modules, String token, Long organizationId, String organizationSlug, String organizationName) {}
  public record RegisterRequest(String username, String email, String password, String confirmPassword, String organizationSlug) {}
  public record ForgotPasswordRequest(String username) {}
  public record ForgotPasswordResponse(String message) {}
  public record ResetPasswordRequest(String username, String code, String newPassword) {}
}
