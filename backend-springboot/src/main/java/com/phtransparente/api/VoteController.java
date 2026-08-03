package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
    return voteRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Vote> getVoteById(@PathVariable @NonNull Long id) {
    return voteRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Vote> createVote(@RequestBody Vote vote) {
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
    return voteRepository.findById(id)
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
    if (voteRepository.existsById(id)) {
      voteRecordRepository.deleteAll(voteRecordRepository.findByVoteId(id));
      voteRepository.deleteById(id);
      return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
  }

  @GetMapping("/status/{status}")
  public List<Vote> getVotesByStatus(@PathVariable String status) {
    return voteRepository.findByStatus(status);
  }

  @GetMapping("/type/{type}")
  public List<Vote> getVotesByType(@PathVariable String type) {
    return voteRepository.findByType(type);
  }

  @GetMapping("/assembly/{assemblyId}")
  public List<Vote> getVotesByAssembly(@PathVariable @NonNull Long assemblyId) {
    return voteRepository.findByAssemblyId(assemblyId);
  }

  @GetMapping("/creator/{createdBy}")
  public List<Vote> getVotesByCreator(@PathVariable String createdBy) {
    return voteRepository.findByCreatedBy(createdBy);
  }

  @PostMapping("/{id}/cast")
  public ResponseEntity<?> castVote(@PathVariable @NonNull Long id, @RequestBody CastVoteRequest request) {
    Optional<Vote> voteOpt = voteRepository.findById(id);
    if (voteOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Vote vote = voteOpt.get();
    if (!"ABIERTA".equals(vote.getStatus())) {
      return ResponseEntity.badRequest().body("La votación no está abierta");
    }

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String username = auth != null ? auth.getName() : request.username();
    User user = userRepository.findByUsername(username);
    if (user == null) {
      return ResponseEntity.badRequest().body("Usuario no encontrado");
    }

    Optional<VoteRecord> existing = voteRecordRepository.findByVoteIdAndUserId(id, user.getId());
    if (existing.isPresent()) {
      return ResponseEntity.badRequest().body("El usuario ya votó");
    }

    String option = request.option();
    if (option == null || (!option.equals("A_FAVOR") && !option.equals("EN_CONTRA") && !option.equals("ABSTENCION"))) {
      return ResponseEntity.badRequest().body("Opción inválida");
    }

    VoteRecord record = new VoteRecord();
    record.setVoteId(id);
    record.setUserId(user.getId());
    record.setUsername(user.getUsername());
    record.setOption(option);
    record.setVotedAt(LocalDateTime.now());
    voteRecordRepository.save(record);

    if ("A_FAVOR".equals(option)) {
      vote.setVotesFor((vote.getVotesFor() != null ? vote.getVotesFor() : 0) + 1);
    } else if ("EN_CONTRA".equals(option)) {
      vote.setVotesAgainst((vote.getVotesAgainst() != null ? vote.getVotesAgainst() : 0) + 1);
    } else {
      vote.setVotesAbstain((vote.getVotesAbstain() != null ? vote.getVotesAbstain() : 0) + 1);
    }
    voteRepository.save(vote);

    return ResponseEntity.ok(record);
  }

  @GetMapping("/{id}/statistics")
  public ResponseEntity<?> getStatistics(@PathVariable @NonNull Long id) {
    Optional<Vote> voteOpt = voteRepository.findById(id);
    if (voteOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    Vote vote = voteOpt.get();
    List<VoteRecord> records = voteRecordRepository.findByVoteId(id);
    List<User> activeUsers = userRepository.findByActive(true);

    List<VoterInfo> voted = records.stream()
      .map(r -> new VoterInfo(r.getUserId(), r.getUsername(), r.getOption(), r.getVotedAt()))
      .toList();

    List<Long> votedUserIds = records.stream().map(VoteRecord::getUserId).toList();
    List<VoterInfo> missing = activeUsers.stream()
      .filter(u -> !votedUserIds.contains(u.getId()))
      .map(u -> new VoterInfo(u.getId(), u.getUsername(), null, null))
      .toList();

    int votesFor = (int) records.stream().filter(r -> "A_FAVOR".equals(r.getOption())).count();
    int votesAgainst = (int) records.stream().filter(r -> "EN_CONTRA".equals(r.getOption())).count();
    int votesAbstain = (int) records.stream().filter(r -> "ABSTENCION".equals(r.getOption())).count();
    int totalVotes = records.size();

    Integer quorumRequired = vote.getQuorumRequired();
    boolean quorumMet = quorumRequired == null || totalVotes >= quorumRequired;
    boolean won = quorumMet && votesFor > votesAgainst;

    return ResponseEntity.ok(new VoteStatistics(
      vote.getId(),
      vote.getTitle(),
      totalVotes,
      votesFor,
      votesAgainst,
      votesAbstain,
      activeUsers.size(),
      quorumMet,
      won,
      voted,
      missing
    ));
  }

  public record CastVoteRequest(String option, String username) {}

  public record VoterInfo(Long userId, String username, String option, LocalDateTime votedAt) {}

  public record VoteStatistics(
    Long voteId,
    String title,
    int totalVotes,
    int votesFor,
    int votesAgainst,
    int votesAbstain,
    int eligibleVoters,
    boolean quorumMet,
    boolean won,
    List<VoterInfo> voted,
    List<VoterInfo> missing
  ) {}
}
