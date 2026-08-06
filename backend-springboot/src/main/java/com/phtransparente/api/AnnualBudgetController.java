package com.phtransparente.api;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/annual-budgets")
public class AnnualBudgetController {
  private final AnnualBudgetRepository annualBudgetRepository;
  private final BudgetItemRepository budgetItemRepository;
  private final BudgetInquiryRepository budgetInquiryRepository;
  private final BudgetProposalRepository budgetProposalRepository;
  private final VoteRecordRepository voteRecordRepository;
  private final UserRepository userRepository;

  public AnnualBudgetController(AnnualBudgetRepository annualBudgetRepository, BudgetItemRepository budgetItemRepository, BudgetInquiryRepository budgetInquiryRepository, BudgetProposalRepository budgetProposalRepository, VoteRecordRepository voteRecordRepository, UserRepository userRepository) {
    this.annualBudgetRepository = annualBudgetRepository;
    this.budgetItemRepository = budgetItemRepository;
    this.budgetInquiryRepository = budgetInquiryRepository;
    this.budgetProposalRepository = budgetProposalRepository;
    this.voteRecordRepository = voteRecordRepository;
    this.userRepository = userRepository;
  }

  // ==================== BUDGET CRUD ====================

  @GetMapping
  public List<AnnualBudget> getAllAnnualBudgets() {
    return annualBudgetRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/{id}")
  public ResponseEntity<AnnualBudget> getAnnualBudgetById(@PathVariable @NonNull Long id) {
    return annualBudgetRepository.findById(id)
      .filter(b -> b.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<AnnualBudget> createAnnualBudget(@RequestBody AnnualBudget annualBudget) {
    annualBudget.setCreatedAt(LocalDate.now());
    annualBudget.setUpdatedAt(LocalDate.now());
    if (annualBudget.getStatus() == null) {
      annualBudget.setStatus("BORRADOR");
    }
    annualBudget.setOrganizationId(TenantContext.getOrganizationId());
    AnnualBudget savedAnnualBudget = annualBudgetRepository.save(annualBudget);
    return ResponseEntity.ok(savedAnnualBudget);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateAnnualBudget(@PathVariable @NonNull Long id, @RequestBody AnnualBudget annualBudget) {
    Long orgId = TenantContext.getOrganizationId();
    return annualBudgetRepository.findById(id)
      .filter(existingAnnualBudget -> existingAnnualBudget.getOrganizationId().equals(orgId))
      .map(existingAnnualBudget -> {
        existingAnnualBudget.setBudgetYear(annualBudget.getBudgetYear());
        existingAnnualBudget.setBudgetName(annualBudget.getBudgetName());
        existingAnnualBudget.setDescription(annualBudget.getDescription());
        existingAnnualBudget.setTotalBudgetedAmount(annualBudget.getTotalBudgetedAmount());
        existingAnnualBudget.setTotalExecutedAmount(annualBudget.getTotalExecutedAmount());
        existingAnnualBudget.setTotalRemainingAmount(annualBudget.getTotalRemainingAmount());
        existingAnnualBudget.setExecutionPercentage(annualBudget.getExecutionPercentage());
        existingAnnualBudget.setApprovalDate(annualBudget.getApprovalDate());
        existingAnnualBudget.setApprovedBy(annualBudget.getApprovedBy());
        existingAnnualBudget.setAssemblyResolution(annualBudget.getAssemblyResolution());
        existingAnnualBudget.setStatus(annualBudget.getStatus());
        existingAnnualBudget.setBudgetType(annualBudget.getBudgetType());
        existingAnnualBudget.setUpdatedAt(LocalDate.now());
        existingAnnualBudget.setUpdatedBy(annualBudget.getUpdatedBy());
        AnnualBudget updatedAnnualBudget = annualBudgetRepository.save(existingAnnualBudget);
        return ResponseEntity.ok(updatedAnnualBudget);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteAnnualBudget(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    return annualBudgetRepository.findById(id)
      .filter(b -> b.getOrganizationId().equals(orgId))
      .map(b -> {
        budgetItemRepository.deleteByOrganizationIdAndBudgetId(orgId, id);
        budgetInquiryRepository.findByOrganizationIdAndBudgetId(orgId, id).forEach(budgetInquiryRepository::delete);
        budgetProposalRepository.findByOrganizationIdAndBudgetId(orgId, id).forEach(p -> {
          voteRecordRepository.findByOrganizationIdAndVoteId(orgId, p.getId()).forEach(voteRecordRepository::delete);
          budgetProposalRepository.delete(p);
        });
        annualBudgetRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/year/{budgetYear}")
  public List<AnnualBudget> getAnnualBudgetsByYear(@PathVariable Integer budgetYear) {
    return annualBudgetRepository.findByOrganizationIdAndBudgetYear(TenantContext.getOrganizationId(), budgetYear);
  }

  @GetMapping("/status/{status}")
  public List<AnnualBudget> getAnnualBudgetsByStatus(@PathVariable String status) {
    return annualBudgetRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/type/{budgetType}")
  public List<AnnualBudget> getAnnualBudgetsByType(@PathVariable String budgetType) {
    return annualBudgetRepository.findByOrganizationIdAndBudgetType(TenantContext.getOrganizationId(), budgetType);
  }

  // ==================== BUDGET ITEMS ====================

  @GetMapping("/{id}/items")
  public ResponseEntity<List<BudgetItem>> getBudgetItems(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    if (!annualBudgetRepository.existsByIdAndOrganizationId(id, TenantContext.getOrganizationId())) return ResponseEntity.notFound().build();
    return ResponseEntity.ok(budgetItemRepository.findByOrganizationIdAndBudgetId(orgId, id));
  }

  @PostMapping("/{id}/items")
  public ResponseEntity<BudgetItem> addBudgetItem(@PathVariable @NonNull Long id, @RequestBody BudgetItem item) {
    Long orgId = TenantContext.getOrganizationId();
    if (!annualBudgetRepository.existsByIdAndOrganizationId(id, orgId)) return ResponseEntity.notFound().build();
    item.setBudgetId(id);
    item.setOrganizationId(orgId);
    return ResponseEntity.ok(budgetItemRepository.save(item));
  }

  @PutMapping("/{id}/items/{itemId}")
  public ResponseEntity<?> updateBudgetItem(@PathVariable @NonNull Long id, @PathVariable @NonNull Long itemId, @RequestBody BudgetItem item) {
    Long orgId = TenantContext.getOrganizationId();
    return budgetItemRepository.findById(itemId)
      .filter(existing -> existing.getOrganizationId().equals(orgId))
      .map(existing -> {
        existing.setCategory(item.getCategory());
        existing.setSubCategory(item.getSubCategory());
        existing.setBudgetedAmount(item.getBudgetedAmount());
        existing.setExecutedAmount(item.getExecutedAmount());
        existing.setRemainingAmount(item.getRemainingAmount());
        existing.setDescription(item.getDescription());
        return ResponseEntity.ok(budgetItemRepository.save(existing));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}/items/{itemId}")
  public ResponseEntity<?> deleteBudgetItem(@PathVariable @NonNull Long id, @PathVariable @NonNull Long itemId) {
    Long orgId = TenantContext.getOrganizationId();
    return budgetItemRepository.findById(itemId)
      .filter(item -> item.getOrganizationId().equals(orgId))
      .map(item -> {
        budgetItemRepository.deleteById(itemId);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  // ==================== BUDGET INQUIRIES ====================

  @GetMapping("/{id}/inquiries")
  public ResponseEntity<List<BudgetInquiry>> getInquiries(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    if (!annualBudgetRepository.existsByIdAndOrganizationId(id, TenantContext.getOrganizationId())) return ResponseEntity.notFound().build();
    return ResponseEntity.ok(budgetInquiryRepository.findByOrganizationIdAndBudgetId(orgId, id));
  }

  @PostMapping("/{id}/inquiries")
  public ResponseEntity<BudgetInquiry> createInquiry(@PathVariable @NonNull Long id, @RequestBody InquiryRequest request) {
    Long orgId = TenantContext.getOrganizationId();
    if (!annualBudgetRepository.existsByIdAndOrganizationId(id, orgId)) return ResponseEntity.notFound().build();
    String username = currentUsername();
    User user = userRepository.findByUsername(username);
    BudgetInquiry inquiry = new BudgetInquiry();
    inquiry.setBudgetId(id);
    inquiry.setOrganizationId(orgId);
    inquiry.setQuestion(request.question());
    inquiry.setAskedBy(username);
    inquiry.setAskedByRole(user != null ? user.getRole() : "UNKNOWN");
    inquiry.setAskedAt(LocalDateTime.now());
    inquiry.setStatus("PENDIENTE");
    return ResponseEntity.ok(budgetInquiryRepository.save(inquiry));
  }

  @PutMapping("/{id}/inquiries/{inquiryId}/answer")
  public ResponseEntity<?> answerInquiry(@PathVariable @NonNull Long id, @PathVariable @NonNull Long inquiryId, @RequestBody AnswerRequest request) {
    Long orgId = TenantContext.getOrganizationId();
    return budgetInquiryRepository.findById(inquiryId)
      .filter(inquiry -> inquiry.getOrganizationId().equals(orgId))
      .map(inquiry -> {
        inquiry.setAnswer(request.answer());
        inquiry.setAnsweredBy(currentUsername());
        inquiry.setAnsweredAt(LocalDateTime.now());
        inquiry.setStatus("RESPONDIDA");
        return ResponseEntity.ok(budgetInquiryRepository.save(inquiry));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/inquiries/pending")
  public List<BudgetInquiry> getPendingInquiries() {
    return budgetInquiryRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), "PENDIENTE");
  }

  // ==================== BUDGET PROPOSALS ====================

  @GetMapping("/{id}/proposals")
  public ResponseEntity<List<BudgetProposal>> getProposals(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    if (!annualBudgetRepository.existsByIdAndOrganizationId(id, TenantContext.getOrganizationId())) return ResponseEntity.notFound().build();
    return ResponseEntity.ok(budgetProposalRepository.findByOrganizationIdAndBudgetId(orgId, id));
  }

  @PostMapping("/{id}/proposals")
  public ResponseEntity<BudgetProposal> createProposal(@PathVariable @NonNull Long id, @RequestBody ProposalRequest request) {
    Long orgId = TenantContext.getOrganizationId();
    if (!annualBudgetRepository.existsByIdAndOrganizationId(id, orgId)) return ResponseEntity.notFound().build();
    BudgetProposal proposal = new BudgetProposal();
    proposal.setBudgetId(id);
    proposal.setOrganizationId(orgId);
    proposal.setTitle(request.title());
    proposal.setDescription(request.description());
    proposal.setEstimatedCost(request.estimatedCost());
    proposal.setProposedBy(currentUsername());
    proposal.setProposedAt(LocalDateTime.now());
    proposal.setStatus("ABIERTA");
    proposal.setVotesFor(0);
    proposal.setVotesAgainst(0);
    proposal.setVotesAbstain(0);
    return ResponseEntity.ok(budgetProposalRepository.save(proposal));
  }

  @PostMapping("/{id}/proposals/{proposalId}/cast")
  public ResponseEntity<?> castProposalVote(@PathVariable @NonNull Long id, @PathVariable @NonNull Long proposalId, @RequestBody CastVoteRequest request) {
    Long orgId = TenantContext.getOrganizationId();
    Optional<BudgetProposal> propOpt = budgetProposalRepository.findById(proposalId)
      .filter(p -> p.getOrganizationId().equals(orgId));
    if (propOpt.isEmpty()) return ResponseEntity.notFound().build();
    BudgetProposal proposal = propOpt.get();
    if (!"ABIERTA".equals(proposal.getStatus())) {
      return ResponseEntity.badRequest().body("La propuesta no esta abierta para votacion");
    }

    String username = currentUsername();
    User user = userRepository.findByUsername(username);
    if (user == null) return ResponseEntity.status(401).body("Usuario no encontrado");

    if (voteRecordRepository.existsByOrganizationIdAndVoteIdAndUserId(orgId, proposalId, user.getId())) {
      return ResponseEntity.badRequest().body("Ya has votado en esta propuesta");
    }

    String choice = request.choice().toUpperCase();
    if (!choice.equals("FAVOR") && !choice.equals("CONTRA") && !choice.equals("ABSTENCION")) {
      return ResponseEntity.badRequest().body("Opcion invalida. Use: FAVOR, CONTRA o ABSTENCION");
    }

    VoteRecord record = new VoteRecord();
    record.setVoteId(proposalId);
    record.setUserId(user.getId());
    record.setUsername(username);
    record.setChoice(choice);
    record.setVotedAt(LocalDateTime.now());
    record.setOrganizationId(orgId);
    voteRecordRepository.save(record);

    long favor = voteRecordRepository.countByOrganizationIdAndVoteIdAndChoice(orgId, proposalId, "FAVOR");
    long contra = voteRecordRepository.countByOrganizationIdAndVoteIdAndChoice(orgId, proposalId, "CONTRA");
    long abstencion = voteRecordRepository.countByOrganizationIdAndVoteIdAndChoice(orgId, proposalId, "ABSTENCION");
    proposal.setVotesFor((int) favor);
    proposal.setVotesAgainst((int) contra);
    proposal.setVotesAbstain((int) abstencion);
    budgetProposalRepository.save(proposal);

    return ResponseEntity.ok(Map.of("message", "Voto registrado", "choice", choice));
  }

  @PostMapping("/{id}/proposals/{proposalId}/close")
  public ResponseEntity<?> closeProposal(@PathVariable @NonNull Long id, @PathVariable @NonNull Long proposalId) {
    Long orgId = TenantContext.getOrganizationId();
    return budgetProposalRepository.findById(proposalId)
      .filter(proposal -> proposal.getOrganizationId().equals(orgId))
      .map(proposal -> {
        proposal.setStatus("CERRADA");
        budgetProposalRepository.save(proposal);
        return ResponseEntity.ok(Map.of("message", "Propuesta cerrada"));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/{id}/proposals/{proposalId}/stats")
  public ResponseEntity<?> getProposalStats(@PathVariable @NonNull Long id, @PathVariable @NonNull Long proposalId) {
    Long orgId = TenantContext.getOrganizationId();
    Optional<BudgetProposal> propOpt = budgetProposalRepository.findById(proposalId)
      .filter(p -> p.getOrganizationId().equals(orgId));
    if (propOpt.isEmpty()) return ResponseEntity.notFound().build();
    BudgetProposal proposal = propOpt.get();

    List<VoteRecord> records = voteRecordRepository.findByOrganizationIdAndVoteIdOrderByVotedAtDesc(orgId, proposalId);
    long favor = voteRecordRepository.countByOrganizationIdAndVoteIdAndChoice(orgId, proposalId, "FAVOR");
    long contra = voteRecordRepository.countByOrganizationIdAndVoteIdAndChoice(orgId, proposalId, "CONTRA");
    long abstencion = voteRecordRepository.countByOrganizationIdAndVoteIdAndChoice(orgId, proposalId, "ABSTENCION");

    List<User> allUsers = userRepository.findByOrganizationId(orgId);
    Set<Long> votedUserIds = new HashSet<>();
    List<Map<String, Object>> votedList = new ArrayList<>();
    for (VoteRecord r : records) {
      votedUserIds.add(r.getUserId());
      Map<String, Object> entry = new LinkedHashMap<>();
      entry.put("username", r.getUsername());
      entry.put("choice", r.getChoice());
      entry.put("votedAt", r.getVotedAt());
      votedList.add(entry);
    }

    List<Map<String, Object>> notVotedList = new ArrayList<>();
    for (User u : allUsers) {
      if (Boolean.TRUE.equals(u.getActive()) && !votedUserIds.contains(u.getId())) {
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("username", u.getUsername());
        entry.put("fullName", u.getFullName());
        entry.put("houseUnit", u.getHouseUnit());
        notVotedList.add(entry);
      }
    }

    long totalEligible = allUsers.stream().filter(u -> Boolean.TRUE.equals(u.getActive())).count();
    long totalVoted = votedUserIds.size();
    double participation = totalEligible > 0 ? (totalVoted * 100.0 / totalEligible) : 0;

    String result = favor > contra ? "APROBADA" : contra > favor ? "RECHAZADA" : "EMPATE";

    Map<String, Object> stats = new LinkedHashMap<>();
    stats.put("title", proposal.getTitle());
    stats.put("status", proposal.getStatus());
    stats.put("favor", favor);
    stats.put("contra", contra);
    stats.put("abstencion", abstencion);
    stats.put("totalVoted", totalVoted);
    stats.put("totalEligible", totalEligible);
    stats.put("pending", totalEligible - totalVoted);
    stats.put("participation", Math.round(participation * 100.0) / 100.0);
    stats.put("result", result);
    stats.put("votedList", votedList);
    stats.put("notVotedList", notVotedList);

    return ResponseEntity.ok(stats);
  }

  // ==================== STATISTICS ====================

  @GetMapping("/stats/summary")
  public ResponseEntity<?> getStatsSummary() {
    List<AnnualBudget> all = annualBudgetRepository.findByOrganizationId(TenantContext.getOrganizationId());
    long total = all.size();
    long borrador = all.stream().filter(b -> "BORRADOR".equals(b.getStatus())).count();
    long aprobado = all.stream().filter(b -> "APROBADO".equals(b.getStatus())).count();
    long ejecucion = all.stream().filter(b -> "EJECUCION".equals(b.getStatus())).count();
    long cerrado = all.stream().filter(b -> "CERRADO".equals(b.getStatus())).count();

    long totalInquiries = budgetInquiryRepository.findByOrganizationId(TenantContext.getOrganizationId()).size();
    long pendingInquiries = budgetInquiryRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), "PENDIENTE").size();
    long answeredInquiries = budgetInquiryRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), "RESPONDIDA").size();

    long totalProposals = budgetProposalRepository.findByOrganizationId(TenantContext.getOrganizationId()).size();
    long openProposals = budgetProposalRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), "ABIERTA").size();

    Map<String, Object> stats = new LinkedHashMap<>();
    stats.put("totalBudgets", total);
    stats.put("borrador", borrador);
    stats.put("aprobado", aprobado);
    stats.put("ejecucion", ejecucion);
    stats.put("cerrado", cerrado);
    stats.put("totalInquiries", totalInquiries);
    stats.put("pendingInquiries", pendingInquiries);
    stats.put("answeredInquiries", answeredInquiries);
    stats.put("totalProposals", totalProposals);
    stats.put("openProposals", openProposals);

    List<Map<String, Object>> budgetsByYear = new ArrayList<>();
    Map<Integer, List<AnnualBudget>> byYear = new TreeMap<>();
    for (AnnualBudget b : all) {
      byYear.computeIfAbsent(b.getBudgetYear(), k -> new ArrayList<>()).add(b);
    }
    for (Map.Entry<Integer, List<AnnualBudget>> entry : byYear.entrySet()) {
      Map<String, Object> yearStats = new LinkedHashMap<>();
      yearStats.put("year", entry.getKey());
      yearStats.put("count", entry.getValue().size());
      budgetsByYear.add(yearStats);
    }
    stats.put("budgetsByYear", budgetsByYear);

    return ResponseEntity.ok(stats);
  }

  // ==================== HELPERS ====================

  private String currentUsername() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return (auth != null && auth.isAuthenticated()) ? auth.getName() : "SYSTEM";
  }

  public record InquiryRequest(String question) {}
  public record AnswerRequest(String answer) {}
  public record ProposalRequest(String title, String description, String estimatedCost) {}
  public record CastVoteRequest(String choice) {}
}
