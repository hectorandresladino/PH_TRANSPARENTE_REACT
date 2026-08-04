package com.phtransparente.api;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {
  List<VoteRecord> findByOrganizationId(Long organizationId);
  List<VoteRecord> findByOrganizationIdAndVoteId(Long organizationId, Long voteId);
  Optional<VoteRecord> findByOrganizationIdAndVoteIdAndUserId(Long organizationId, Long voteId, Long userId);
  boolean existsByOrganizationIdAndVoteIdAndUserId(Long organizationId, Long voteId, Long userId);
  long countByOrganizationIdAndVoteIdAndChoice(Long organizationId, Long voteId, String choice);
  List<VoteRecord> findByOrganizationIdAndVoteIdOrderByVotedAtDesc(Long organizationId, Long voteId);
  List<VoteRecord> findByVoteId(Long voteId);
  Optional<VoteRecord> findByVoteIdAndUserId(Long voteId, Long userId);
  boolean existsByVoteIdAndUserId(Long voteId, Long userId);
  long countByVoteIdAndChoice(Long voteId, String choice);
  List<VoteRecord> findByVoteIdOrderByVotedAtDesc(Long voteId);
}
