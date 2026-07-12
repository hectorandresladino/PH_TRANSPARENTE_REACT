package com.phtransparente.api;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Utilidad para generar y validar tokens JWT firmados con HMAC-SHA256.
 * El secreto se lee de la propiedad app.jwt.secret (por defecto un valor
 * generado aleatoriamente en cada arranque, solo apto para desarrollo).
 */
@Component
public class JwtUtil {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
  private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 horas

  private final SecretKey key;

  public JwtUtil(@Value("${app.jwt.secret:}") String secret) {
    if (secret == null || secret.isBlank()) {
      // Desarrollo: generar secreto aleatorio y advertir.
      byte[] randomBytes = new byte[32];
      java.security.SecureRandom secureRandom = new java.security.SecureRandom();
      secureRandom.nextBytes(randomBytes);
      this.key = Keys.hmacShaKeyFor(randomBytes);
      logger.warn("No se configuró app.jwt.secret; se generó un secreto aleatorio para esta sesión (NO APTO PARA PRODUCCIÓN).");
    } else {
      this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
  }

  public String generateToken(String username, String role) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + EXPIRATION_MS);
    return Jwts.builder()
      .subject(username)
      .claim("role", role)
      .issuedAt(now)
      .expiration(expiry)
      .id(UUID.randomUUID().toString())
      .signWith(key, Jwts.SIG.HS256)
      .compact();
  }

  public Claims parseToken(String token) {
    return Jwts.parser()
      .verifyWith(key)
      .build()
      .parseSignedClaims(token)
      .getPayload();
  }

  public boolean isTokenValid(String token) {
    try {
      Claims claims = parseToken(token);
      return claims.getExpiration().after(new Date());
    } catch (JwtException | IllegalArgumentException e) {
      logger.warn("Token JWT inválido: {}", e.getMessage());
      return false;
    }
  }

  public String extractUsername(String token) {
    return parseToken(token).getSubject();
  }

  public String extractRole(String token) {
    Object role = parseToken(token).get("role");
    return role == null ? null : role.toString();
  }
}
