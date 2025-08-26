package com.vexura.repository;

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
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    
    Optional<Policy> findByPolicyId(String policyId);
    
    List<Policy> findByUser(User user);
    
    List<Policy> findByStatus(Policy.PolicyStatus status);
    
    List<Policy> findByVehicleType(String vehicleType);
    
    @Query("SELECT p FROM Policy p WHERE p.endDate < :currentDate AND p.status = 'EXPIRED'")
    List<Policy> findExpiredPolicies(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT p FROM Policy p WHERE p.endDate < :currentDate AND p.status = 'ACTIVE'")
    List<Policy> findActivePoliciesWithExpiredEndDate(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT p FROM Policy p WHERE p.endDate BETWEEN :startDate AND :endDate")
    List<Policy> findPoliciesExpiringBetween(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM Policy p WHERE p.user.customerId = :customerId")
    List<Policy> findByCustomerId(@Param("customerId") String customerId);
}
