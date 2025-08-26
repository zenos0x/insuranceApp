package com.vexura.repository;

import com.vexura.entity.Claim;
import com.vexura.entity.Policy;
import com.vexura.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    
    Optional<Claim> findByClaimId(String claimId);
    
    List<Claim> findByUser(User user);
    
    List<Claim> findByPolicy(Policy policy);
    
    List<Claim> findByStatus(Claim.ClaimStatus status);
    
    @Query("SELECT c FROM Claim c WHERE c.user.customerId = :customerId")
    List<Claim> findByCustomerId(@Param("customerId") String customerId);
    
    @Query("SELECT c FROM Claim c WHERE c.claimDate BETWEEN :startDate AND :endDate")
    List<Claim> findByClaimDateBetween(@Param("startDate") LocalDate startDate, 
                                     @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Claim c WHERE c.status = 'PENDING' ORDER BY c.claimDate ASC")
    List<Claim> findPendingClaims();
}
