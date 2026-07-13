package com.phtransparente.api;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Política de contraseñas alineada con ISO 27001 (control A.5.17).
 * Valida fortaleza mínima de contraseñas nuevas.
 */
@Component
public class PasswordPolicy {

  private static final int MIN_LENGTH = 8;
  private static final int MAX_LENGTH = 128;

  public PasswordValidationResult validate(String password) {
    List<String> errors = new ArrayList<>();

    if (password == null || password.isEmpty()) {
      errors.add("La contraseña es obligatoria");
      return new PasswordValidationResult(false, errors);
    }

    if (password.length() < MIN_LENGTH) {
      errors.add("Debe tener al menos " + MIN_LENGTH + " caracteres");
    }

    if (password.length() > MAX_LENGTH) {
      errors.add("No debe superar los " + MAX_LENGTH + " caracteres");
    }

    if (!password.matches(".*[A-Z].*")) {
      errors.add("Debe contener al menos una letra mayúscula");
    }

    if (!password.matches(".*[a-z].*")) {
      errors.add("Debe contener al menos una letra minúscula");
    }

    if (!password.matches(".*\\d.*")) {
      errors.add("Debe contener al menos un número");
    }

    if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
      errors.add("Debe contener al menos un carácter especial (!@#$%^&*)");
    }

    return new PasswordValidationResult(errors.isEmpty(), errors);
  }

  public record PasswordValidationResult(boolean valid, List<String> errors) {}
}
