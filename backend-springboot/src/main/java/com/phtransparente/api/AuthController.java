package com.phtransparente.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final VerificationService verificationService;
  private final EmailService emailService;

  public AuthController(UserRepository userRepository, RoleRepository roleRepository, VerificationService verificationService, EmailService emailService) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.verificationService = verificationService;
    this.emailService = emailService;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    logger.info("Intento de login para usuario: {}", request.username());
    User user = userRepository.findByUsername(request.username());
    
    if (user != null && user.getPassword().equals(request.password())) {
      logger.info("Login exitoso para usuario: {}", request.username());
      // Obtener el rol y sus módulos permitidos
      Role role = roleRepository.findByName(user.getRole()).orElse(null);
      String modules = role != null ? role.getModules() : "";
      
      return ResponseEntity.ok(new LoginResponse(user.getId(), user.getUsername(), user.getRole(), modules));
    }
    
    logger.warn("Login fallido para usuario: {}", request.username());
    return ResponseEntity.status(401).body("Credenciales inválidas");
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    User existingUser = userRepository.findByUsername(request.username());
    
    if (existingUser != null) {
      return ResponseEntity.status(400).body("El usuario ya existe");
    }
    
    User newUser = new User();
    newUser.setUsername(request.username());
    newUser.setPassword(request.password());
    newUser.setRole("COPROPIETARIO");
    newUser.setEmail(request.email());
    newUser.setActive(true);
    
    User savedUser = userRepository.save(newUser);
    
    // Obtener módulos del rol
    Role role = roleRepository.findByName(savedUser.getRole()).orElse(null);
    String modules = role != null ? role.getModules() : "";
    
    return ResponseEntity.ok(new LoginResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getRole(), modules));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    User user = userRepository.findByUsername(request.username());
    
    if (user == null) {
      return ResponseEntity.status(404).body("Usuario no encontrado");
    }
    
    // En un sistema real, aquí se enviaría un email con enlace de recuperación
    // Por ahora, simulamos la recuperación mostrando la contraseña
    return ResponseEntity.ok(new ForgotPasswordResponse("Se ha enviado un enlace de recuperación a tu correo", user.getPassword()));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
    User user = userRepository.findByUsername(request.username());
    
    if (user == null) {
      return ResponseEntity.status(404).body("Usuario no encontrado");
    }
    
    user.setPassword(request.newPassword());
    userRepository.save(user);
    
    return ResponseEntity.ok("Contraseña actualizada exitosamente");
  }

  @PostMapping("/send-verification-code")
  public ResponseEntity<?> sendVerificationCode(@RequestBody SendVerificationCodeRequest request) {
    logger.info("Solicitud de código de verificación para usuario: {}", request.username());
    
    try {
      String code = verificationService.createAndSendVerificationCode(request.username());
      return ResponseEntity.ok(new SendVerificationCodeResponse("Código enviado exitosamente", code));
    } catch (IllegalArgumentException e) {
      logger.error("Error al enviar código: {}", e.getMessage());
      return ResponseEntity.status(400).body(e.getMessage());
    }
  }

  @PostMapping("/verify-code")
  public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
    logger.info("Verificación de código para usuario: {}", request.username());
    
    boolean isValid = verificationService.verifyCode(request.username(), request.code());
    
    if (isValid) {
      // Enviar alerta de inicio de sesión por correo
      User user = userRepository.findByUsername(request.username());
      if (user != null && user.getEmail() != null && !user.getEmail().isEmpty()) {
        emailService.sendLoginAlert(user.getEmail(), user.getUsername());
      }
      return ResponseEntity.ok(new VerifyCodeResponse("Código verificado exitosamente", true));
    } else {
      return ResponseEntity.status(400).body("Código inválido o expirado");
    }
  }

  public record LoginRequest(String username, String password) {}
  public record LoginResponse(Long id, String username, String role, String modules) {}
  public record RegisterRequest(String username, String email, String password, String confirmPassword) {}
  public record ForgotPasswordRequest(String username) {}
  public record ForgotPasswordResponse(String message, String currentPassword) {}
  public record ResetPasswordRequest(String username, String newPassword) {}
  public record SendVerificationCodeRequest(String username) {}
  public record SendVerificationCodeResponse(String message, String code) {}
  public record VerifyCodeRequest(String username, String code) {}
  public record VerifyCodeResponse(String message, boolean success) {}
}
