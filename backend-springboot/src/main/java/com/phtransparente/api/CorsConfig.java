package com.phtransparente.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
  @Bean
  @SuppressWarnings("null")
  public WebMvcConfigurer corsConfigurer(@Value("${app.cors.allowed-origins:*}") String origins) {
    final String[] allowedOrigins = origins.split("\\s*,\\s*");
    final boolean allowAll = allowedOrigins.length == 1 && "*".equals(allowedOrigins[0]);
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(@NonNull CorsRegistry registry) {
        if (allowAll) {
          // Desarrollo y OpenShift: permitir cualquier origen
          registry.addMapping("/api/**")
            .allowedOriginPatterns("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
            .allowedHeaders("*")
            .allowCredentials(false)
            .maxAge(3600);
        } else {
          // Producción: solo orígenes explícitos configurados en app.cors.allowed-origins.
          registry.addMapping("/api/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
        }
      }
    };
  }
}
