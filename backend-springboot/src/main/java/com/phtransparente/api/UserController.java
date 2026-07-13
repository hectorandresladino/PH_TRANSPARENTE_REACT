package com.phtransparente.api;

import java.security.SecureRandom;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserRepository userRepository;
  private final EmailService emailService;
  private final PasswordEncoder passwordEncoder;
  private final AuditLogService auditLogService;
  private final PasswordPolicy passwordPolicy;
  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  public UserController(UserRepository userRepository, EmailService emailService, PasswordEncoder passwordEncoder, AuditLogService auditLogService, PasswordPolicy passwordPolicy) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.passwordEncoder = passwordEncoder;
    this.auditLogService = auditLogService;
    this.passwordPolicy = passwordPolicy;
  }

  private static boolean isBCryptHash(String value) {
    return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
  }

  @GetMapping
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable @NonNull Long id) {
    return userRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<?> createUser(@RequestBody User user, HttpServletRequest httpRequest) {
    if (userRepository.existsByUsername(user.getUsername())) {
      auditLogService.log("USER_CREATE_FAILED", currentUsername(), currentRole(), "Intento de crear usuario existente: " + user.getUsername(), httpRequest, "FAIL");
      return ResponseEntity.badRequest().body("El usuario ya existe");
    }
    if (user.getPassword() != null && !user.getPassword().isEmpty() && !isBCryptHash(user.getPassword())) {
      PasswordPolicy.PasswordValidationResult validation = passwordPolicy.validate(user.getPassword());
      if (!validation.valid()) {
        return ResponseEntity.badRequest().body("Contraseña débil: " + String.join(", ", validation.errors()));
      }
      user.setPassword(passwordEncoder.encode(user.getPassword()));
    }
    User savedUser = userRepository.save(user);
    auditLogService.log("USER_CREATED", currentUsername(), currentRole(), "Usuario creado: " + savedUser.getUsername(), "USER", savedUser.getId(), httpRequest, "SUCCESS");
    return ResponseEntity.ok(savedUser);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateUser(@PathVariable @NonNull Long id, @RequestBody User user, HttpServletRequest httpRequest) {
    if (user.getPassword() != null && !user.getPassword().isEmpty() && !isBCryptHash(user.getPassword())) {
      PasswordPolicy.PasswordValidationResult validation = passwordPolicy.validate(user.getPassword());
      if (!validation.valid()) {
        return ResponseEntity.badRequest().body("Contraseña débil: " + String.join(", ", validation.errors()));
      }
    }
    return userRepository.findById(id)
      .map(existingUser -> {
        existingUser.setUsername(user.getUsername());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
          String newPassword = isBCryptHash(user.getPassword())
            ? user.getPassword()
            : passwordEncoder.encode(user.getPassword());
          existingUser.setPassword(newPassword);
        }
        existingUser.setRole(user.getRole());
        existingUser.setEmail(user.getEmail());
        existingUser.setFullName(user.getFullName());
        existingUser.setPhone(user.getPhone());
        existingUser.setHouseUnit(user.getHouseUnit());
        existingUser.setActive(user.getActive());
        User updatedUser = userRepository.save(existingUser);
        auditLogService.log("USER_UPDATED", currentUsername(), currentRole(), "Usuario actualizado: " + updatedUser.getUsername(), "USER", updatedUser.getId(), httpRequest, "SUCCESS");
        return ResponseEntity.ok(updatedUser);
      })
      .orElseGet(() -> {
        auditLogService.log("USER_UPDATE_FAILED", currentUsername(), currentRole(), "Usuario no encontrado para actualizar: ID " + id, httpRequest, "FAIL");
        return ResponseEntity.notFound().build();
      });
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable @NonNull Long id, HttpServletRequest httpRequest) {
    if (userRepository.existsById(id)) {
      userRepository.deleteById(id);
      auditLogService.log("USER_DELETED", currentUsername(), currentRole(), "Usuario eliminado: ID " + id, "USER", id, httpRequest, "SUCCESS");
      return ResponseEntity.ok().build();
    }
    auditLogService.log("USER_DELETE_FAILED", currentUsername(), currentRole(), "Usuario no encontrado para eliminar: ID " + id, httpRequest, "FAIL");
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/role/{role}")
  public List<User> getUsersByRole(@PathVariable String role) {
    return userRepository.findByRole(role);
  }

  @GetMapping("/active/{active}")
  public List<User> getUsersByActive(@PathVariable Boolean active) {
    return userRepository.findByActive(active);
  }

  @PostMapping("/generate-password")
  public ResponseEntity<?> generatePassword(@RequestBody GeneratePasswordRequest request) {
    if (request.email() == null || request.email().isEmpty()) {
      return ResponseEntity.badRequest().body("El correo electronico es obligatorio");
    }

    String chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    StringBuilder password = new StringBuilder();
    for (int i = 0; i < 12; i++) {
      password.append(chars.charAt(SECURE_RANDOM.nextInt(chars.length())));
    }

    String generatedPassword = password.toString();
    emailService.sendPassword(request.email(), generatedPassword);

    return ResponseEntity.ok(new GeneratePasswordResponse(generatedPassword));
  }

  public record GeneratePasswordRequest(String email) {}
  public record GeneratePasswordResponse(String password) {}

  private String currentUsername() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return (auth != null && auth.isAuthenticated()) ? auth.getName() : "SYSTEM";
  }

  private String currentRole() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) return "UNKNOWN";
    return auth.getAuthorities().stream()
      .findFirst()
      .map(a -> a.getAuthority().replace("ROLE_", ""))
      .orElse("UNKNOWN");
  }
}
