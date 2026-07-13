package com.phtransparente.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración de seguridad stateless basada en JWT.
 * Los endpoints de autenticación son públicos; el resto de /api/** requiere
 * un token JWT válido en el header Authorization: Bearer <token>.
 * CORS se sigue manejando en {@link CorsConfig}.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/forgot-password", "/api/auth/reset-password").permitAll()
        .requestMatchers("/api/auth/send-verification-code", "/api/auth/verify-code").permitAll()
        .requestMatchers("/api/health").permitAll()
        .requestMatchers("/api/**").authenticated()
        .anyRequest().permitAll()
      )
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
