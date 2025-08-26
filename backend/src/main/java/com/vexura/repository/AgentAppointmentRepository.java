package com.vexura.repository;

import com.vexura.entity.AgentAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentAppointmentRepository extends JpaRepository<AgentAppointment, Long> {
    boolean existsByEmail(String email);
}
