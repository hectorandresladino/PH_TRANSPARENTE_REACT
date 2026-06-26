package com.phtransparente.api;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
public class VoteController {
  private final VoteRepository voteRepository;

  public VoteController(VoteRepository voteRepository) {
    this.voteRepository = voteRepository;
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
}
