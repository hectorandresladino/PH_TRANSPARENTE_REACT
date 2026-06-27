package com.phtransparente.api;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
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
}
