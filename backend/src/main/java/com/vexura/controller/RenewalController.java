
package com.vexura.controller;

import com.vexura.entity.Policy;
import com.vexura.entity.Renewal;
import com.vexura.service.PolicyService;
import com.vexura.service.RenewalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/renewals")
public class RenewalController {

    @Autowired
    private RenewalService renewalService;

    @Autowired
    private PolicyService policyService;

    @GetMapping
    public List<Renewal> getAllRenewals() {
        return renewalService.getAllRenewals();
    }

    @GetMapping("/customer/{customerId}")
    public List<Renewal> getRenewalsByCustomerId(@PathVariable String customerId) {
        return renewalService.getRenewalsByCustomerId(customerId);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRenewal(@RequestBody Map<String, Object> renewalData) {
        try {
            String oldPolicyId = (String) renewalData.get("policyId");
            Policy oldPolicy = policyService.getPolicyByPolicyId(oldPolicyId)
                    .orElseThrow(() -> new RuntimeException("Policy not found"));

            // Expire the old policy
            oldPolicy.setStatus(Policy.PolicyStatus.RENEWED);
            policyService.updatePolicy(oldPolicy.getId(), oldPolicy);

            // Create a new policy
            Policy newPolicy = new Policy();
            newPolicy.setUser(oldPolicy.getUser());
            newPolicy.setVehicleType(oldPolicy.getVehicleType());
            newPolicy.setVehicleNumber(oldPolicy.getVehicleNumber());
            newPolicy.setCoverageType((String) renewalData.get("coverageType")); // Assuming coverage type can change
            newPolicy.setName(oldPolicy.getName());
            newPolicy.setAadharNumber(oldPolicy.getAadharNumber());
            newPolicy.setMobileNumber(oldPolicy.getMobileNumber());
            newPolicy.setEmail(oldPolicy.getEmail());
            newPolicy.setRegistrationCertificate(oldPolicy.getRegistrationCertificate());
            newPolicy.setPremiumAmount(new BigDecimal(renewalData.get("totalPremium").toString()));
            newPolicy.setCoverageAmount(new BigDecimal(renewalData.get("coverageAmount").toString())); // Assuming coverage amount can change
            newPolicy.setStartDate(LocalDate.now());
            newPolicy.setEndDate(LocalDate.now().plusYears((Integer) renewalData.get("extendPeriod")));
            newPolicy.setStatus(Policy.PolicyStatus.ACTIVE);

            Policy createdPolicy = policyService.createPolicy(newPolicy);

            // Create the renewal record linked to the new policy
            Renewal renewal = new Renewal();
            renewal.setPolicy(createdPolicy);
            renewal.setUser(createdPolicy.getUser());
            renewal.setRenewalDate(LocalDate.now());
            renewal.setNewPremium(new BigDecimal(renewalData.get("totalPremium").toString()));
            renewal.setExpiryYear(createdPolicy.getEndDate().getYear());

            Renewal createdRenewal = renewalService.createRenewal(renewal);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "renewal", createdRenewal,
                    "message", "Renewal successful and new policy created."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Error creating renewal: " + e.getMessage()
            ));
        }
    }
}
