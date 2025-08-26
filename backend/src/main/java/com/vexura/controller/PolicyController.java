package com.vexura.controller;

import com.vexura.entity.Policy;
import com.vexura.entity.User;
import com.vexura.service.PolicyService;
import com.vexura.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/policies")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Policy> getAllPolicies() {
        return policyService.getAllPolicies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Policy> getPolicyById(@PathVariable Long id) {
        return policyService.getPolicyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/policy/{policyId}")
    public ResponseEntity<Policy> getPolicyByPolicyId(@PathVariable String policyId) {
        return policyService.getPolicyByPolicyId(policyId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Policy> getPoliciesByCustomerId(@PathVariable String customerId) {
        return policyService.getPoliciesByCustomerId(customerId);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPolicy(@RequestBody Map<String, Object> policyData) {
        try {
            String customerId = (String) policyData.get("customerId");
            User user = userService.getUserByCustomerId(customerId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Policy policy = new Policy();
            policy.setUser(user);
            policy.setVehicleType((String) policyData.get("vehicleType"));
            policy.setVehicleNumber((String) policyData.get("vehicleNumber"));
            policy.setCoverageType((String) policyData.get("coverageType"));
            policy.setName((String) policyData.get("name"));
            policy.setAadharNumber((String) policyData.get("aadharNumber"));
            policy.setMobileNumber((String) policyData.get("mobileNumber"));
            policy.setEmail((String) policyData.get("email"));
            policy.setRegistrationCertificate((String) policyData.get("registrationCertificate"));
            policy.setPremiumAmount(new java.math.BigDecimal(policyData.get("premiumAmount").toString()));
            policy.setCoverageAmount(new java.math.BigDecimal(policyData.get("coverageAmount").toString()));
            policy.setStartDate(java.time.LocalDate.parse((String) policyData.get("startDate")));
            policy.setEndDate(java.time.LocalDate.parse((String) policyData.get("endDate")));

            Policy createdPolicy = policyService.createPolicy(policy);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "policy", createdPolicy,
                "message", "Policy created successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error creating policy: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Policy> updatePolicy(@PathVariable Long id, @RequestBody Policy policyDetails) {
        try {
            Policy updatedPolicy = policyService.updatePolicy(id, policyDetails);
            return ResponseEntity.ok(updatedPolicy);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/expired")
    public List<Policy> getExpiredPolicies() {
        return policyService.getExpiredPolicies();
    }

    @GetMapping("/expiring/{days}")
    public List<Policy> getPoliciesExpiringInDays(@PathVariable int days) {
        return policyService.getPoliciesExpiringInDays(days);
    }
}
