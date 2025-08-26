package com.vexura.service;

import com.vexura.entity.Claim;
import com.vexura.entity.User;
import com.vexura.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Optional<Claim> getClaimById(Long id) {
        return claimRepository.findById(id);
    }

    public Optional<Claim> getClaimByClaimId(String claimId) {
        return claimRepository.findByClaimId(claimId);
    }

    public List<Claim> getClaimsByUser(User user) {
        return claimRepository.findByUser(user);
    }

    public List<Claim> getClaimsByCustomerId(String customerId) {
        return claimRepository.findByCustomerId(customerId);
    }

    public List<Claim> getPendingClaims() {
        return claimRepository.findPendingClaims();
    }

    public Claim createClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    public Claim updateClaimStatus(Long id, Claim.ClaimStatus status, String remark, String approvedBy) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with ID: " + id));

        claim.setStatus(status);
        claim.setRemark(remark);
        claim.setApprovedBy(approvedBy);
        
        if (status == Claim.ClaimStatus.APPROVED || status == Claim.ClaimStatus.REJECTED) {
            claim.setApprovedDate(LocalDateTime.now());
        }

        return claimRepository.save(claim);
    }

    public Claim updateClaim(Long id, Claim claimDetails) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setClaimAmount(claimDetails.getClaimAmount());
        claim.setReason(claimDetails.getReason());
        claim.setProofDocument(claimDetails.getProofDocument());
        claim.setStatus(claimDetails.getStatus());
        claim.setRemark(claimDetails.getRemark());

        return claimRepository.save(claim);
    }

    public void deleteClaim(Long id) {
        claimRepository.deleteById(id);
    }

    public List<Claim> getClaimsByStatus(Claim.ClaimStatus status) {
        return claimRepository.findByStatus(status);
    }
}
