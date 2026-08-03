package com.phtransparente.api;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

  private final AiAssistantService aiAssistantService;

  public AiAssistantController(AiAssistantService aiAssistantService) {
    this.aiAssistantService = aiAssistantService;
  }

  @GetMapping("/pqr/{id}/suggest")
  public ResponseEntity<?> suggestPqrResponse(@PathVariable @NonNull Long id) {
    Map<String, Object> result = aiAssistantService.suggestPqrResponse(id);
    if (result.containsKey("error")) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(result);
  }

  @GetMapping("/budget/{id}/analyze")
  public ResponseEntity<?> analyzeBudget(@PathVariable @NonNull Long id) {
    Map<String, Object> result = aiAssistantService.analyzeBudget(id);
    if (result.containsKey("error")) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(result);
  }
}
