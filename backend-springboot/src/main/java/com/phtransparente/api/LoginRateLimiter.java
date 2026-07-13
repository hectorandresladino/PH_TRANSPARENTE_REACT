package com.phtransparente.api;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

/**
 * Limitador de intentos de login en memoria para mitigar ataques de fuerza bruta.
 * Bloquea temporalmente una clave (usuario) tras superar el número máximo de
 * intentos fallidos dentro de la ventana de bloqueo.
 */
@Component
public class LoginRateLimiter {
  private static final int MAX_ATTEMPTS = 10;
  private static final Duration LOCKOUT_DURATION = Duration.ofMinutes(5);

  private static final class Attempt {
    int count;
    Instant lockedUntil;
  }

  private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

  private String normalize(String key) {
    return key == null ? "" : key.trim().toLowerCase();
  }

  /** Devuelve true si la clave está actualmente bloqueada. */
  public boolean isBlocked(String key) {
    Attempt attempt = attempts.get(normalize(key));
    if (attempt == null || attempt.lockedUntil == null) {
      return false;
    }
    if (Instant.now().isAfter(attempt.lockedUntil)) {
      // Expiró el bloqueo: limpiar
      attempts.remove(normalize(key));
      return false;
    }
    return true;
  }

  /** Segundos restantes de bloqueo (0 si no está bloqueado). */
  public long secondsUntilUnlock(String key) {
    Attempt attempt = attempts.get(normalize(key));
    if (attempt == null || attempt.lockedUntil == null) {
      return 0;
    }
    long seconds = Duration.between(Instant.now(), attempt.lockedUntil).getSeconds();
    return Math.max(seconds, 0);
  }

  /** Registra un intento fallido y aplica bloqueo si se supera el máximo. */
  public void recordFailure(String key) {
    String k = normalize(key);
    attempts.compute(k, (ignored, existing) -> {
      Attempt attempt = (existing == null) ? new Attempt() : existing;
      attempt.count++;
      if (attempt.count >= MAX_ATTEMPTS) {
        attempt.lockedUntil = Instant.now().plus(LOCKOUT_DURATION);
      }
      return attempt;
    });
  }

  /** Limpia el registro tras un login exitoso. */
  public void reset(String key) {
    attempts.remove(normalize(key));
  }
}
