package com.vexura.repository;

import com.vexura.entity.Renewal;
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
public interface RenewalRepository extends JpaRepository<Renewal, Long> {
    
    Optional<Renewal> findByRenewalId(String renewalId);
    
    List<Renewal> findByUser(User user);
    
    List<Renewal> findByPolicy(Policy policy);
    
    List<Renewal> findByStatus(Renewal.RenewalStatus status);
    
    @Query("SELECT r FROM Renewal r WHERE r.user.customerId = :customerId")
    List<Renewal> findByCustomerId(@Param("customerId") String customerId);
    
    @Query("SELECT r FROM Renewal r WHERE r.renewalDate BETWEEN :startDate AND :endDate")
    List<Renewal> findByRenewalDateBetween(@Param("startDate") LocalDate startDate, 
                                         @Param("endDate") LocalDate endDate);
    
    @Query("SELECT r FROM Renewal r WHERE r.expiryYear = :year")
    List<Renewal> findByExpiryYear(@Param("year") Integer year);
}
