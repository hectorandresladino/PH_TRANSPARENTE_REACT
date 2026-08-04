package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
public class VoteController {
  private final VoteRepository voteRepository;
  private final VoteRecordRepository voteRecordRepository;
  private final UserRepository userRepository;

  public VoteController(VoteRepository voteRepository, VoteRecordRepository voteRecordRepository, UserRepository userRepository) {
    this.voteRepository = voteRepository;
    this.voteRecordRepository = voteRecordRepository;
    this.userRepository = userRepository;
  }

  @GetMapping
  public List<Vote> getAllVotes() {
    return voteRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Vote> getVoteById(@PathVariable @NonNull Long id) {
    return voteRepository.findById(id)
      .filter(v -> v.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Vote> createVote(@RequestBody Vote vote) {
    vote.setOrganizationId(TenantContext.getOrganizationId());
    vote.setCreatedAt(LocalDateTime.now());
    if (vote.getStatus() == null) {
      vote.setStatus("ABIERTA");
    }
    if (vote.getVotesFor() == null) {
      vote.setVotesFor(0);
    }
    if (vote.getVotesAgainst() == null) {
      vote.setVotesAgainst(0);
    }
    if (vote.getVotesAbstain() == null) {
      vote.setVotesAbstain(0);
    }
    Vote savedVote = voteRepository.save(vote);
    return ResponseEntity.ok(savedVote);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateVote(@PathVariable @NonNull Long id, @RequestBody Vote vote) {
    Long orgId = TenantContext.getOrganizationId();
    return voteRepository.findById(id)
      .filter(existingVote -> existingVote.getOrganizationId().equals(orgId))
      .map(existingVote -> {
        existingVote.setTitle(vote.getTitle());
        existingVote.setDescription(vote.getDescription());
        existingVote.setType(vote.getType());
        existingVote.setAssemblyId(vote.getAssemblyId());
        existingVote.setStartDate(vote.getStartDate());
        existingVote.setEndDate(vote.getEndDate());
        existingVote.setStatus(vote.getStatus());
        existingVote.setVotesFor(vote.getVotesFor());
        existingVote.setVotesAgainst(vote.getVotesAgainst());
        existingVote.setVotesAbstain(vote.getVotesAbstain());
        existingVote.setQuorumRequired(vote.getQuorumRequired());
        Vote updatedVote = voteRepository.save(existingVote);
        return ResponseEntity.ok(updatedVote);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteVote(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    Optional<Vote> voteOpt = voteRepository.findById(id);
    if (voteOpt.isPresent() && voteOpt.get().getOrganizationId().equals(orgId)) {
      voteRecordRepository.findByVoteId(id).forEach(voteRecordRepository::delete);
      voteRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Vote> getVotesByStatus(@PathVariable String status) {
    return voteRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/type/{type}")
  public List<Vote> getVotesByType(@PathVariable String type) {
    return voteRepository.findByOrganizationIdAndType(TenantContext.getOrganizationId(), type);
  }

  @GetMapping("/assembly/{assemblyId}")
  public List<Vote> getVotesByAssembly(@PathVariable @NonNull Long assemblyId) {
    return voteRepository.findByOrganizationIdAndAssemblyId(TenantContext.getOrganizationId(), assemblyId);
  }

  @GetMapping("/creator/{createdBy}")
  public List<Vote> getVotesByCreator(@PathVariable String createdBy) {
    return voteRepository.findByOrganizationIdAndCreatedBy(TenantContext.getOrganizationId(), createdBy);
  }

  @PostMapping("/{id}/cast")
  public ResponseEntity<?> castVote(@PathVariable @NonNull Long id, @RequestBody CastVoteRequest request) {
    Long orgId = TenantContext.getOrganizationId();
    Optional<Vote> voteOpt = voteRepository.findById(id)
      .filter(v -> v.getOrganizationId().equals(orgId));
    if (voteOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    Vote vote = voteOpt.get();
    if (!"ABIERTA".equals(vote.getStatus())) {
      return ResponseEntity.badRequest().body("La votacion no esta abierta");
    }

    String username = currentUsername();
    User user = userRepository.findByUsername(username);
    if (user == null) {
      return ResponseEntity.status(401).body("Usuario no encontrado");
    }

    if (voteRecordRepository.existsByVoteIdAndUserId(id, user.getId())) {
      return ResponseEntity.badRequest().body("Ya has votado en esta propuesta");
    }

    String choice = request.choice().toUpperCase();
    if (!choice.equals("FAVOR") && !choice.equals("CONTRA") && !choice.equals("ABSTENCION")) {
      return ResponseEntity.badRequest().body("Opcion invalida. Use: FAVOR, CONTRA o ABSTENCION");
    }

    VoteRecord record = new VoteRecord();
    record.setVoteId(id);
    record.setUserId(user.getId());
    record.setUsername(username);
    record.setChoice(choice);
    record.setVotedAt(LocalDateTime.now());
    voteRecordRepository.save(record);

    recalculateVoteCounts(vote);

    return ResponseEntity.ok(Map.of("message", "Voto registrado exitosamente", "choice", choice));
  }

  @GetMapping("/{id}/stats")
  public ResponseEntity<?> getVoteStats(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    Optional<Vote> voteOpt = voteRepository.findById(id)
      .filter(v -> v.getOrganizationId().equals(orgId));
    if (voteOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    Vote vote = voteOpt.get();

    List<VoteRecord> records = voteRecordRepository.findByVoteIdOrderByVotedAtDesc(id);
    long favor = voteRecordRepository.countByVoteIdAndChoice(id, "FAVOR");
    long contra = voteRecordRepository.countByVoteIdAndChoice(id, "CONTRA");
    long abstencion = voteRecordRepository.countByVoteIdAndChoice(id, "ABSTENCION");

    List<User> allUsers = userRepository.findAll();
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

    boolean approved = favor > contra;
    boolean tie = favor == contra;
    String result;
    if (tie) {
      result = "EMPATE";
    } else if (approved) {
      result = "APROBADA";
    } else {
      result = "RECHAZADA";
    }

    Map<String, Object> stats = new LinkedHashMap<>();
    stats.put("voteId", id);
    stats.put("title", vote.getTitle());
    stats.put("status", vote.getStatus());
    stats.put("favor", favor);
    stats.put("contra", contra);
    stats.put("abstencion", abstencion);
    stats.put("totalVoted", totalVoted);
    stats.put("totalEligible", totalEligible);
    stats.put("pending", totalEligible - totalVoted);
    stats.put("participation", Math.round(participation * 100.0) / 100.0);
    stats.put("result", result);
    stats.put("approved", approved);
    stats.put("votedList", votedList);
    stats.put("notVotedList", notVotedList);

    return ResponseEntity.ok(stats);
  }

  @PostMapping("/{id}/close")
  public ResponseEntity<?> closeVote(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    Optional<Vote> voteOpt = voteRepository.findById(id)
      .filter(v -> v.getOrganizationId().equals(orgId));
    if (voteOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    Vote vote = voteOpt.get();
    recalculateVoteCounts(vote);
    vote.setStatus("CERRADA");
    voteRepository.save(vote);
    return ResponseEntity.ok(Map.of("message", "Votacion cerrada", "votesFor", vote.getVotesFor(), "votesAgainst", vote.getVotesAgainst(), "votesAbstain", vote.getVotesAbstain()));
  }

  @GetMapping("/{id}/my-vote")
  public ResponseEntity<?> getMyVote(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    Optional<Vote> voteOpt = voteRepository.findById(id)
      .filter(v -> v.getOrganizationId().equals(orgId));
    if (voteOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    String username = currentUsername();
    User user = userRepository.findByUsername(username);
    if (user == null) {
      return ResponseEntity.status(401).body("Usuario no encontrado");
    }
    Optional<VoteRecord> record = voteRecordRepository.findByVoteIdAndUserId(id, user.getId());
    if (record.isPresent()) {
      return ResponseEntity.ok(Map.of("choice", record.get().getChoice(), "votedAt", record.get().getVotedAt()));
    }
    return ResponseEntity.ok(Map.of("voted", false));
  }

  private void recalculateVoteCounts(Vote vote) {
    long favor = voteRecordRepository.countByVoteIdAndChoice(vote.getId(), "FAVOR");
    long contra = voteRecordRepository.countByVoteIdAndChoice(vote.getId(), "CONTRA");
    long abstencion = voteRecordRepository.countByVoteIdAndChoice(vote.getId(), "ABSTENCION");
    vote.setVotesFor((int) favor);
    vote.setVotesAgainst((int) contra);
    vote.setVotesAbstain((int) abstencion);
    voteRepository.save(vote);
  }

  private String currentUsername() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return (auth != null && auth.isAuthenticated()) ? auth.getName() : "SYSTEM";
  }

  public record CastVoteRequest(String choice) {}
}
