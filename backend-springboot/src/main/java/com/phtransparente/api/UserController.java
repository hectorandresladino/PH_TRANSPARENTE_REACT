package com.phtransparente.api;

import java.util.List;
import java.util.Random;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserRepository userRepository;
  private final EmailService emailService;

  public UserController(UserRepository userRepository, EmailService emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
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
  public ResponseEntity<?> createUser(@RequestBody User user) {
    if (userRepository.existsByUsername(user.getUsername())) {
      return ResponseEntity.badRequest().body("El usuario ya existe");
    }
    User savedUser = userRepository.save(user);
    return ResponseEntity.ok(savedUser);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateUser(@PathVariable @NonNull Long id, @RequestBody User user) {
    return userRepository.findById(id)
      .map(existingUser -> {
        existingUser.setUsername(user.getUsername());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
          existingUser.setPassword(user.getPassword());
        }
        existingUser.setRole(user.getRole());
        existingUser.setEmail(user.getEmail());
        existingUser.setFullName(user.getFullName());
        existingUser.setPhone(user.getPhone());
        existingUser.setHouseUnit(user.getHouseUnit());
        existingUser.setActive(user.getActive());
        User updatedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(updatedUser);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable @NonNull Long id) {
    if (userRepository.existsById(id)) {
      userRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
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
    Random random = new Random();
    for (int i = 0; i < 8; i++) {
      password.append(chars.charAt(random.nextInt(chars.length())));
    }

    String generatedPassword = password.toString();
    emailService.sendPassword(request.email(), generatedPassword);

    return ResponseEntity.ok(new GeneratePasswordResponse(generatedPassword));
  }

  public record GeneratePasswordRequest(String email) {}
  public record GeneratePasswordResponse(String password) {}
}
