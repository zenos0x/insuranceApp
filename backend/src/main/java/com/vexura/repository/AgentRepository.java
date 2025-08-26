package com.vexura.repository;

import com.vexura.entity.Agent;
import com.vexura.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    
    Optional<Agent> findByAgentId(String agentId);
    
    Optional<Agent> findByUser(User user);
    
    List<Agent> findByRole(Agent.AgentRole role);
    
    List<Agent> findByDistrict(String district);
    
    List<Agent> findByRoleAndDistrict(Agent.AgentRole role, String district);
}