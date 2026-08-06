package com.phtransparente.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

class SaasAuthorizationFilterTest {
  private UserRepository userRepository;
  private RoleRepository roleRepository;
  private SaasAccessService accessService;
  private SaasAuthorizationFilter filter;
  private User user;

  @BeforeEach
  void setUp() {
    userRepository = mock(UserRepository.class);
    roleRepository = mock(RoleRepository.class);
    accessService = mock(SaasAccessService.class);
    filter = new SaasAuthorizationFilter(userRepository, roleRepository, accessService);

    user = new User();
    user.setUsername("residente");
    user.setRole("COPROPIETARIO");
    user.setOrganizationId(7L);
    when(userRepository.findByUsername("residente")).thenReturn(user);
    Role role = new Role("COPROPIETARIO", "Residente", "pqr,payments");
    when(roleRepository.findByName("COPROPIETARIO")).thenReturn(Optional.of(role));
    SecurityContextHolder.getContext().setAuthentication(
      new UsernamePasswordAuthenticationToken("residente", null, List.of()));
  }

  @AfterEach
  void tearDown() {
    SecurityContextHolder.clearContext();
  }

  @Test
  void allowsModuleIncludedInRoleAndPlan() throws Exception {
    when(accessService.effectiveModules(7L, "pqr,payments")).thenReturn("pqr");
    MockFilterChain chain = new MockFilterChain();
    MockHttpServletResponse response = new MockHttpServletResponse();

    filter.doFilter(new MockHttpServletRequest("GET", "/api/pqrs"), response, chain);

    assertEquals(200, response.getStatus());
    assertNotNull(chain.getRequest());
  }

  @Test
  void deniesModuleExcludedByPlan() throws Exception {
    when(accessService.effectiveModules(7L, "pqr,payments")).thenReturn("pqr");
    MockFilterChain chain = new MockFilterChain();
    MockHttpServletResponse response = new MockHttpServletResponse();

    filter.doFilter(new MockHttpServletRequest("GET", "/api/payments"), response, chain);

    assertEquals(403, response.getStatus());
    assertNull(chain.getRequest());
  }

  @Test
  void deniesUnauthorizedWriteEvenWhenModuleIsVisible() throws Exception {
    when(accessService.effectiveModules(7L, "pqr,payments")).thenReturn("pqr,payments");
    MockFilterChain chain = new MockFilterChain();
    MockHttpServletResponse response = new MockHttpServletResponse();

    filter.doFilter(new MockHttpServletRequest("DELETE", "/api/payments/1"), response, chain);

    assertEquals(403, response.getStatus());
    assertNull(chain.getRequest());
  }
}
