package com.phtransparente.api;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "official_minutes_book")
public class OfficialMinutesBook {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String minuteNumber;

  @Column(name = "assembly_type", nullable = false)
  private String assemblyType;

  @Column(name = "meeting_date", nullable = false)
  private LocalDate meetingDate;

  @Column(name = "meeting_time")
  private String meetingTime;

  @Column(name = "meeting_location")
  private String meetingLocation;

  @Column(name = "call_method")
  private String callMethod;

  @Column(name = "quorum_present")
  private String quorumPresent;

  @Column(name = "quorum_percentage")
  private Double quorumPercentage;

  @Column(name = "total_units")
  private Integer totalUnits;

  @Column(name = "units_present")
  private Integer unitsPresent;

  @Column(name = "units_represented")
  private Integer unitsRepresented;

  @Column(name = "agenda_items")
  private String agendaItems;

  @Column(name = "decisions_made")
  private String decisionsMade;

  @Column(name = "votes_for")
  private Integer votesFor;

  @Column(name = "votes_against")
  private Integer votesAgainst;

  @Column(name = "votes_abstained")
  private Integer votesAbstained;

  @Column(name = "president_name")
  private String presidentName;

  @Column(name = "secretary_name")
  private String secretaryName;

  @Column(name = "president_signature")
  private String presidentSignature;

  @Column(name = "secretary_signature")
  private String secretarySignature;

  @Column(name = "approval_date")
  private LocalDate approvalDate;

  @Column(name = "approved_by")
  private String approvedBy;

  private String status;

  @Column(name = "minute_document")
  private String minuteDocument;

  @Column(name = "attachments")
  private String attachments;

  @Column(name = "observations")
  private String observations;

  @Column(name = "created_at")
  private LocalDate createdAt;

  @Column(name = "created_by")
  private String createdBy;

  @Column(name = "updated_at")
  private LocalDate updatedAt;

  @Column(name = "updated_by")
  private String updatedBy;

  public OfficialMinutesBook() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getMinuteNumber() { return minuteNumber; }
  public void setMinuteNumber(String minuteNumber) { this.minuteNumber = minuteNumber; }

  public String getAssemblyType() { return assemblyType; }
  public void setAssemblyType(String assemblyType) { this.assemblyType = assemblyType; }

  public LocalDate getMeetingDate() { return meetingDate; }
  public void setMeetingDate(LocalDate meetingDate) { this.meetingDate = meetingDate; }

  public String getMeetingTime() { return meetingTime; }
  public void setMeetingTime(String meetingTime) { this.meetingTime = meetingTime; }

  public String getMeetingLocation() { return meetingLocation; }
  public void setMeetingLocation(String meetingLocation) { this.meetingLocation = meetingLocation; }

  public String getCallMethod() { return callMethod; }
  public void setCallMethod(String callMethod) { this.callMethod = callMethod; }

  public String getQuorumPresent() { return quorumPresent; }
  public void setQuorumPresent(String quorumPresent) { this.quorumPresent = quorumPresent; }

  public Double getQuorumPercentage() { return quorumPercentage; }
  public void setQuorumPercentage(Double quorumPercentage) { this.quorumPercentage = quorumPercentage; }

  public Integer getTotalUnits() { return totalUnits; }
  public void setTotalUnits(Integer totalUnits) { this.totalUnits = totalUnits; }

  public Integer getUnitsPresent() { return unitsPresent; }
  public void setUnitsPresent(Integer unitsPresent) { this.unitsPresent = unitsPresent; }

  public Integer getUnitsRepresented() { return unitsRepresented; }
  public void setUnitsRepresented(Integer unitsRepresented) { this.unitsRepresented = unitsRepresented; }

  public String getAgendaItems() { return agendaItems; }
  public void setAgendaItems(String agendaItems) { this.agendaItems = agendaItems; }

  public String getDecisionsMade() { return decisionsMade; }
  public void setDecisionsMade(String decisionsMade) { this.decisionsMade = decisionsMade; }

  public Integer getVotesFor() { return votesFor; }
  public void setVotesFor(Integer votesFor) { this.votesFor = votesFor; }

  public Integer getVotesAgainst() { return votesAgainst; }
  public void setVotesAgainst(Integer votesAgainst) { this.votesAgainst = votesAgainst; }

  public Integer getVotesAbstained() { return votesAbstained; }
  public void setVotesAbstained(Integer votesAbstained) { this.votesAbstained = votesAbstained; }

  public String getPresidentName() { return presidentName; }
  public void setPresidentName(String presidentName) { this.presidentName = presidentName; }

  public String getSecretaryName() { return secretaryName; }
  public void setSecretaryName(String secretaryName) { this.secretaryName = secretaryName; }

  public String getPresidentSignature() { return presidentSignature; }
  public void setPresidentSignature(String presidentSignature) { this.presidentSignature = presidentSignature; }

  public String getSecretarySignature() { return secretarySignature; }
  public void setSecretarySignature(String secretarySignature) { this.secretarySignature = secretarySignature; }

  public LocalDate getApprovalDate() { return approvalDate; }
  public void setApprovalDate(LocalDate approvalDate) { this.approvalDate = approvalDate; }

  public String getApprovedBy() { return approvedBy; }
  public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getMinuteDocument() { return minuteDocument; }
  public void setMinuteDocument(String minuteDocument) { this.minuteDocument = minuteDocument; }

  public String getAttachments() { return attachments; }
  public void setAttachments(String attachments) { this.attachments = attachments; }

  public String getObservations() { return observations; }
  public void setObservations(String observations) { this.observations = observations; }

  public LocalDate getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

  public String getCreatedBy() { return createdBy; }
  public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

  public LocalDate getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

  public String getUpdatedBy() { return updatedBy; }
  public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
