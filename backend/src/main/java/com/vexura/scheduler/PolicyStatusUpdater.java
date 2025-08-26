
package com.vexura.scheduler;

import com.vexura.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PolicyStatusUpdater {

    @Autowired
    private PolicyService policyService;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void updatePolicyStatus() {
        policyService.expirePolicies();
    }
}
