package com.vexura.service;

import com.vexura.entity.Policy;
import com.vexura.entity.User;
import com.vexura.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    public Optional<Policy> getPolicyById(Long id) {
        return policyRepository.findById(id);
    }

    public Optional<Policy> getPolicyByPolicyId(String policyId) {
        return policyRepository.findByPolicyId(policyId);
    }

    public List<Policy> getPoliciesByUser(User user) {
        return policyRepository.findByUser(user);
    }

    public List<Policy> getPoliciesByCustomerId(String customerId) {
        return policyRepository.findByCustomerId(customerId);
    }

    public Policy createPolicy(Policy policy) {
        return policyRepository.save(policy);
    }

    public Policy updatePolicy(Long id, Policy policyDetails) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        policy.setVehicleType(policyDetails.getVehicleType());
        policy.setVehicleNumber(policyDetails.getVehicleNumber());
        policy.setCoverageType(policyDetails.getCoverageType());
        policy.setPremiumAmount(policyDetails.getPremiumAmount());
        policy.setCoverageAmount(policyDetails.getCoverageAmount());
        policy.setStartDate(policyDetails.getStartDate());
        policy.setEndDate(policyDetails.getEndDate());
        policy.setStatus(policyDetails.getStatus());

        return policyRepository.save(policy);
    }

    public void deletePolicy(Long id) {
        policyRepository.deleteById(id);
    }

    public List<Policy> getExpiredPolicies() {
        return policyRepository.findExpiredPolicies(LocalDate.now());
    }

    public void expirePolicies() {
        List<Policy> policiesToExpire = policyRepository.findActivePoliciesWithExpiredEndDate(LocalDate.now());
        for (Policy policy : policiesToExpire) {
            policy.setStatus(Policy.PolicyStatus.EXPIRED);
            policyRepository.save(policy);
        }
    }

    public List<Policy> getPoliciesExpiringInDays(int days) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);
        return policyRepository.findPoliciesExpiringBetween(startDate, endDate);
    }

    public List<Policy> getPoliciesByStatus(Policy.PolicyStatus status) {
        return policyRepository.findByStatus(status);
    }
}
