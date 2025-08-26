package com.vexura.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "renewals")
public class Renewal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Renewal ID is required")
    @Column(name = "renewal_id", unique = true, nullable = false)
    private String renewalId;

    @NotNull(message = "Policy is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Renewal date is required")
    @Column(name = "renewal_date", nullable = false)
    private LocalDate renewalDate;

    @NotNull(message = "New premium is required")
    @Column(name = "new_premium", nullable = false, precision = 10, scale = 2)
    private BigDecimal newPremium;

    @NotNull(message = "Expiry year is required")
    @Column(name = "expiry_year", nullable = false)
    private Integer expiryYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RenewalStatus status = RenewalStatus.SUBMITTED;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (renewalId == null) {
            renewalId = "RN" + String.format("%03d", System.currentTimeMillis() % 1000);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Renewal() {}

    public Renewal(Policy policy, User user, LocalDate renewalDate, 
                   BigDecimal newPremium, Integer expiryYear) {
        this.policy = policy;
        this.user = user;
        this.renewalDate = renewalDate;
        this.newPremium = newPremium;
        this.expiryYear = expiryYear;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRenewalId() { return renewalId; }
    public void setRenewalId(String renewalId) { this.renewalId = renewalId; }

    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getRenewalDate() { return renewalDate; }
    public void setRenewalDate(LocalDate renewalDate) { this.renewalDate = renewalDate; }

    public BigDecimal getNewPremium() { return newPremium; }
    public void setNewPremium(BigDecimal newPremium) { this.newPremium = newPremium; }

    public Integer getExpiryYear() { return expiryYear; }
    public void setExpiryYear(Integer expiryYear) { this.expiryYear = expiryYear; }

    public RenewalStatus getStatus() { return status; }
    public void setStatus(RenewalStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum RenewalStatus {
        SUBMITTED, UNDER_REVIEW, COMPLETED, CANCELLED
    }
}
