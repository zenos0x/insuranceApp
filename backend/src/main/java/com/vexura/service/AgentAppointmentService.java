package com.vexura.service;

import com.vexura.entity.AgentAppointment;
import com.vexura.repository.AgentAppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AgentAppointmentService {

    @Autowired
    private AgentAppointmentRepository agentAppointmentRepository;

    public AgentAppointment createAppointment(AgentAppointment appointment) {
        if (agentAppointmentRepository.existsByEmail(appointment.getEmail())) {
            throw new IllegalStateException("An application with this email already exists.");
        }
        return agentAppointmentRepository.save(appointment);
    }
}
