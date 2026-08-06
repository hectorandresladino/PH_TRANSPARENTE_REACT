package com.phtransparente.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/saas")
public class SaasAccountController {
  private final SaasAccessService saasAccessService;

  public SaasAccountController(SaasAccessService saasAccessService) {
    this.saasAccessService = saasAccessService;
  }

  @GetMapping("/account")
  public ResponseEntity<SaasAccessService.AccountSummary> account() {
    return ResponseEntity.ok(saasAccessService.accountSummary(TenantContext.getOrganizationId()));
  }
}
