package com.vexura.controller;

import com.vexura.entity.Agent;
import com.vexura.entity.AgentAppointment;
import com.vexura.entity.User;
import com.vexura.service.AgentAppointmentService;
import com.vexura.service.AgentService;
import com.vexura.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/agents")
public class AgentController {

    @Autowired
    private AgentService agentService;

    @Autowired
    private UserService userService;

    @Autowired
    private AgentAppointmentService agentAppointmentService;

    @GetMapping
    public List<Agent> getAllAgents() {
        return agentService.getAllAgents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agent> getAgentById(@PathVariable Long id) {
        return agentService.getAgentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Agent> createAgent(@RequestBody Map<String, Object> agentData) {
        Long userId = Long.parseLong(agentData.get("userId").toString());
        String role = (String) agentData.get("role");
        String district = (String) agentData.get("district");

        User user = userService.getUserById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(User.UserRole.valueOf(role.toUpperCase()));
        userService.updateUser(userId, user);

        Agent agent = new Agent();
        agent.setUser(user);
        agent.setRole(Agent.AgentRole.valueOf(role.toUpperCase()));
        agent.setDistrict(district);

        return ResponseEntity.ok(agentService.createAgent(agent));
    }

    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> applyAsAgent(@RequestBody Map<String, Object> applicationData) {
        try {
            AgentAppointment appointment = new AgentAppointment();
            appointment.setName((String) applicationData.get("name"));
            appointment.setEmail((String) applicationData.get("email"));
            appointment.setMobile((String) applicationData.get("mobile"));
            appointment.setCity((String) applicationData.get("city"));
            String dob = (String) applicationData.get("dateOfBirth");
            if (dob != null && !dob.isEmpty()) {
                appointment.setDateOfBirth(LocalDate.parse(dob));
            }

            AgentAppointment savedAppointment = agentAppointmentService.createAppointment(appointment);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "appointment", savedAppointment,
                    "message", "Agent application submitted successfully."
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "An unexpected error occurred: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agent> updateAgent(@PathVariable Long id, @RequestBody Agent agentDetails) {
        try {
            Agent updatedAgent = agentService.updateAgent(id, agentDetails);
            return ResponseEntity.ok(updatedAgent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long id) {
        agentService.deleteAgent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/district/{district}")
    public List<Agent> getAgentsByDistrict(@PathVariable String district) {
        return agentService.getAgentsByDistrict(district);
    }
}