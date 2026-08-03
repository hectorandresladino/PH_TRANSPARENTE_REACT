package com.phtransparente.api;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {
  List<VoteRecord> findByVoteId(Long voteId);
  Optional<VoteRecord> findByVoteIdAndUserId(Long voteId, Long userId);
  boolean existsByVoteIdAndUserId(Long voteId, Long userId);
  long countByVoteIdAndChoice(Long voteId, String choice);
  List<VoteRecord> findByVoteIdOrderByVotedAtDesc(Long voteId);
}
