package com.phtransparente.api;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "plans")
public class Plan {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String code;

  @Column(nullable = false)
  private String name;

  private String description;

  @Column(nullable = false)
  private BigDecimal price = BigDecimal.ZERO;

  @Column(nullable = false)
  private String billingPeriod = "MONTHLY"; // MONTHLY, YEARLY

  @Column(nullable = false, length = 2000)
  private String modules; // comma-separated module names

  @Column(nullable = false)
  private Integer maxUsers = 10;

  @Column(nullable = false)
  private Integer maxUnits = 50;

  @Column(nullable = false)
  private Boolean active = true;

  public Plan() {}

  public Plan(String code, String name, String description, BigDecimal price, String billingPeriod,
              String modules, Integer maxUsers, Integer maxUnits, Boolean active) {
    this.code = code;
    this.name = name;
    this.description = description;
    this.price = price;
    this.billingPeriod = billingPeriod;
    this.modules = modules;
    this.maxUsers = maxUsers;
    this.maxUnits = maxUnits;
    this.active = active;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getCode() { return code; }
  public void setCode(String code) { this.code = code; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public BigDecimal getPrice() { return price; }
  public void setPrice(BigDecimal price) { this.price = price; }

  public String getBillingPeriod() { return billingPeriod; }
  public void setBillingPeriod(String billingPeriod) { this.billingPeriod = billingPeriod; }

  public String getModules() { return modules; }
  public void setModules(String modules) { this.modules = modules; }

  public Integer getMaxUsers() { return maxUsers; }
  public void setMaxUsers(Integer maxUsers) { this.maxUsers = maxUsers; }

  public Integer getMaxUnits() { return maxUnits; }
  public void setMaxUnits(Integer maxUnits) { this.maxUnits = maxUnits; }

  public Boolean getActive() { return active; }
  public void setActive(Boolean active) { this.active = active; }
}
