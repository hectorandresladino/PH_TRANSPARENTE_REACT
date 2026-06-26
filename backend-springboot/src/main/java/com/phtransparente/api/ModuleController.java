package com.phtransparente.api;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ModuleController {
  private final ModuleService service;

  public ModuleController(ModuleService service) {
    this.service = service;
  }

  @GetMapping("/health")
  public String health() {
    return "PH Transparente API OK";
  }

  @GetMapping("/modules")
  public List<ModuleDto> modules() {
    return service.findAll();
  }

  @GetMapping("/modules/{id}")
  public ModuleDto module(@PathVariable Integer id) {
    return service.findById(id);
  }

  @GetMapping("/dashboard")
  public DashboardDto dashboard() {
    return service.getDashboardStats();
  }
}
