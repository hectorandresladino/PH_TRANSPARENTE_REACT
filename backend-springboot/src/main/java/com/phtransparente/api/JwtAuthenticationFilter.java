package com.phtransparente.api;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filtro que extrae y valida el token JWT del header Authorization
 * y establece la autenticación en el SecurityContext de Spring.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private static final String AUTHORIZATION_HEADER = "Authorization";
  private static final String BEARER_PREFIX = "Bearer ";

  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;
  private final SaasAccessService saasAccessService;

  public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository,
                                 SaasAccessService saasAccessService) {
    this.jwtUtil = jwtUtil;
    this.userRepository = userRepository;
    this.saasAccessService = saasAccessService;
  }

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
      throws ServletException, IOException {

    final String authHeader = request.getHeader(AUTHORIZATION_HEADER);

    if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
      final String token = authHeader.substring(BEARER_PREFIX.length()).trim();

      if (!token.isEmpty() && jwtUtil.isTokenValid(token)) {
        Claims claims = jwtUtil.parseToken(token);
        String username = claims.getSubject();
        String role = claims.get("role", String.class);
        Object orgIdClaim = claims.get("organizationId");
        Long organizationId = orgIdClaim == null ? null : Long.valueOf(orgIdClaim.toString());
        User currentUser = userRepository.findByUsername(username);

        if (currentUser == null || !Boolean.TRUE.equals(currentUser.getActive())
            || role == null || !role.equalsIgnoreCase(currentUser.getRole())
            || !java.util.Objects.equals(organizationId, currentUser.getOrganizationId())
            || ("SUPERADMIN".equalsIgnoreCase(role) && !Long.valueOf(0L).equals(organizationId))) {
          response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "La sesion ya no es valida");
          return;
        }

        SaasAccessService.AccessDecision access = saasAccessService.validateAccess(organizationId, role);
        if (!access.allowed()) {
          response.sendError(HttpServletResponse.SC_FORBIDDEN, access.message());
          return;
        }
        String authority = role != null ? "ROLE_" + role.toUpperCase() : "ROLE_USER";

        UsernamePasswordAuthenticationToken authentication =
          new UsernamePasswordAuthenticationToken(
            username,
            null,
            Collections.singletonList(new SimpleGrantedAuthority(authority)));

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Establecer tenant en el contexto de la petición
        if (organizationId != null) {
          TenantContext.setOrganizationId(organizationId);
        }
      }
    }

    try {
      filterChain.doFilter(request, response);
    } finally {
      TenantContext.clear();
      SecurityContextHolder.clearContext();
    }
  }
}
