package com.vexura.controller;
import com.vexura.entity.Agent;
import com.vexura.entity.Claim;
import com.vexura.entity.Policy;
import com.vexura.entity.User;
import com.vexura.repository.AgentRepository;
import com.vexura.service.ClaimService;
import com.vexura.service.PolicyService;
import com.vexura.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/claims")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private PolicyService policyService;

    @Autowired
    private UserService userService;

    @Autowired
    private AgentRepository agentRepository;

    @GetMapping
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Claim> getClaimById(@PathVariable Long id) {
        return claimService.getClaimById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/claim/{claimId}")
    public ResponseEntity<Claim> getClaimByClaimId(@PathVariable String claimId) {
        return claimService.getClaimByClaimId(claimId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Claim> getClaimsByCustomerId(@PathVariable String customerId) {
        return claimService.getClaimsByCustomerId(customerId);
    }

    @GetMapping("/pending")
    public List<Claim> getPendingClaims() {
        return claimService.getPendingClaims();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createClaim(@RequestBody Map<String, Object> claimData) {
        try {
            String policyId = (String) claimData.get("policyId");
            String customerId = (String) claimData.get("customerId");

            Policy policy = policyService.getPolicyByPolicyId(policyId)
                    .orElseThrow(() -> new RuntimeException("Policy not found"));

            User user = userService.getUserByCustomerId(customerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Claim claim = new Claim();
            claim.setPolicy(policy);
            claim.setUser(user);
            claim.setClaimAmount(new java.math.BigDecimal(claimData.get("claimAmount").toString()));
            claim.setReason((String) claimData.get("reason"));
            claim.setProofDocument((String) claimData.get("proofDocument"));

            Claim createdClaim = claimService.createClaim(claim);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "claim", createdClaim,
                "message", "Claim submitted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error creating claim: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Claim> updateClaimStatus(@PathVariable Long id, 
                                                  @RequestBody Map<String, String> statusData) {
        try {
            Claim.ClaimStatus status = Claim.ClaimStatus.valueOf(statusData.get("status").toUpperCase());
            String remark = statusData.get("remark");
            String agentId = statusData.get("approvedBy");

            Agent agent = agentRepository.findByAgentId(agentId)
                    .orElseThrow(() -> new RuntimeException("Agent not found with ID: " + agentId));

            String approvedByName = agent.getUser().getName();

            Claim updatedClaim = claimService.updateClaimStatus(id, status, remark, approvedByName);
            return ResponseEntity.ok(updatedClaim);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.ok().build();
    }
}