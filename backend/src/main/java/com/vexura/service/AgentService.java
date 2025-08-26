package com.vexura.service;

import com.vexura.entity.Agent;
import com.vexura.entity.User;
import com.vexura.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgentService {

    @Autowired
    private AgentRepository agentRepository;

    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    public Optional<Agent> getAgentById(Long id) {
        return agentRepository.findById(id);
    }

    public Optional<Agent> getAgentByAgentId(String agentId) {
        return agentRepository.findByAgentId(agentId);
    }

    public Optional<Agent> getAgentByUser(User user) {
        return agentRepository.findByUser(user);
    }

    public Agent createAgent(Agent agent) {
        return agentRepository.save(agent);
    }

    public Agent updateAgent(Long id, Agent agentDetails) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        agent.setRole(agentDetails.getRole());
        agent.setDistrict(agentDetails.getDistrict());

        return agentRepository.save(agent);
    }

    public void deleteAgent(Long id) {
        agentRepository.deleteById(id);
    }

    public List<Agent> getAgentsByRole(Agent.AgentRole role) {
        return agentRepository.findByRole(role);
    }

    public List<Agent> getAgentsByDistrict(String district) {
        return agentRepository.findByDistrict(district);
    }
}
