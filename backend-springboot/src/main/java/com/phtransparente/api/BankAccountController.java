package com.phtransparente.api;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bank-accounts")
public class BankAccountController {
  private final BankAccountRepository bankAccountRepository;

  public BankAccountController(BankAccountRepository bankAccountRepository) {
    this.bankAccountRepository = bankAccountRepository;
  }

  @GetMapping
  public List<BankAccount> getAllBankAccounts() {
    return bankAccountRepository.findByOrganizationId(TenantContext.getOrganizationId());
  }

  @GetMapping("/{id}")
  public ResponseEntity<BankAccount> getBankAccountById(@PathVariable @NonNull Long id) {
    return bankAccountRepository.findById(id)
      .filter(b -> b.getOrganizationId().equals(TenantContext.getOrganizationId()))
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<BankAccount> createBankAccount(@RequestBody BankAccount bankAccount) {
    bankAccount.setOrganizationId(TenantContext.getOrganizationId());
    bankAccount.setCreatedAt(LocalDate.now());
    bankAccount.setUpdatedAt(LocalDate.now());
    if (bankAccount.getStatus() == null) {
      bankAccount.setStatus("ACTIVO");
    }
    BankAccount savedBankAccount = bankAccountRepository.save(bankAccount);
    return ResponseEntity.ok(savedBankAccount);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateBankAccount(@PathVariable @NonNull Long id, @RequestBody BankAccount bankAccount) {
    Long orgId = TenantContext.getOrganizationId();
    return bankAccountRepository.findById(id)
      .filter(existingBankAccount -> existingBankAccount.getOrganizationId().equals(orgId))
      .map(existingBankAccount -> {
        existingBankAccount.setAccountNumber(bankAccount.getAccountNumber());
        existingBankAccount.setBankName(bankAccount.getBankName());
        existingBankAccount.setAccountType(bankAccount.getAccountType());
        existingBankAccount.setAccountName(bankAccount.getAccountName());
        existingBankAccount.setCurrentBalance(bankAccount.getCurrentBalance());
        existingBankAccount.setAccountPurpose(bankAccount.getAccountPurpose());
        existingBankAccount.setIsOperational(bankAccount.getIsOperational());
        existingBankAccount.setIsReserveFund(bankAccount.getIsReserveFund());
        existingBankAccount.setOpeningDate(bankAccount.getOpeningDate());
        existingBankAccount.setClosingDate(bankAccount.getClosingDate());
        existingBankAccount.setStatus(bankAccount.getStatus());
        existingBankAccount.setAuthorizedSignatories(bankAccount.getAuthorizedSignatories());
        existingBankAccount.setAccountManager(bankAccount.getAccountManager());
        existingBankAccount.setManagerPhone(bankAccount.getManagerPhone());
        existingBankAccount.setManagerEmail(bankAccount.getManagerEmail());
        existingBankAccount.setBranchOffice(bankAccount.getBranchOffice());
        existingBankAccount.setSwiftCode(bankAccount.getSwiftCode());
        existingBankAccount.setAccountCurrency(bankAccount.getAccountCurrency());
        existingBankAccount.setMinimumBalance(bankAccount.getMinimumBalance());
        existingBankAccount.setOverdraftLimit(bankAccount.getOverdraftLimit());
        existingBankAccount.setInterestRate(bankAccount.getInterestRate());
        existingBankAccount.setMonthlyFee(bankAccount.getMonthlyFee());
        existingBankAccount.setLastStatementDate(bankAccount.getLastStatementDate());
        existingBankAccount.setNextStatementDate(bankAccount.getNextStatementDate());
        existingBankAccount.setObservations(bankAccount.getObservations());
        existingBankAccount.setUpdatedAt(LocalDate.now());
        existingBankAccount.setUpdatedBy(bankAccount.getUpdatedBy());
        
        BankAccount updatedBankAccount = bankAccountRepository.save(existingBankAccount);
        return ResponseEntity.ok(updatedBankAccount);
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteBankAccount(@PathVariable @NonNull Long id) {
    Long orgId = TenantContext.getOrganizationId();
    return bankAccountRepository.findById(id)
      .filter(b -> b.getOrganizationId().equals(orgId))
      .map(b -> {
        bankAccountRepository.deleteById(id);
        return ResponseEntity.ok().build();
      })
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/status/{status}")
  public List<BankAccount> getBankAccountsByStatus(@PathVariable String status) {
    return bankAccountRepository.findByOrganizationIdAndStatus(TenantContext.getOrganizationId(), status);
  }

  @GetMapping("/type/{accountType}")
  public List<BankAccount> getBankAccountsByType(@PathVariable String accountType) {
    return bankAccountRepository.findByOrganizationIdAndAccountType(TenantContext.getOrganizationId(), accountType);
  }

  @GetMapping("/bank/{bankName}")
  public List<BankAccount> getBankAccountsByBank(@PathVariable String bankName) {
    return bankAccountRepository.findByOrganizationIdAndBankName(TenantContext.getOrganizationId(), bankName);
  }

  @GetMapping("/operational")
  public List<BankAccount> getOperationalAccounts() {
    return bankAccountRepository.findByOrganizationIdAndIsOperational(TenantContext.getOrganizationId(), true);
  }

  @GetMapping("/reserve-fund")
  public List<BankAccount> getReserveFundAccounts() {
    return bankAccountRepository.findByOrganizationIdAndIsReserveFund(TenantContext.getOrganizationId(), true);
  }
}
