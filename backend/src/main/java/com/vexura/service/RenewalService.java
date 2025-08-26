package com.vexura.service;

import com.vexura.entity.Renewal;
import com.vexura.entity.User;
import com.vexura.repository.RenewalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RenewalService {

    @Autowired
    private RenewalRepository renewalRepository;

    public List<Renewal> getAllRenewals() {
        return renewalRepository.findAll();
    }

    public Optional<Renewal> getRenewalById(Long id) {
        return renewalRepository.findById(id);
    }

    public Optional<Renewal> getRenewalByRenewalId(String renewalId) {
        return renewalRepository.findByRenewalId(renewalId);
    }

    public List<Renewal> getRenewalsByUser(User user) {
        return renewalRepository.findByUser(user);
    }

    public List<Renewal> getRenewalsByCustomerId(String customerId) {
        return renewalRepository.findByCustomerId(customerId);
    }

    public Renewal createRenewal(Renewal renewal) {
        return renewalRepository.save(renewal);
    }

    public Renewal updateRenewal(Long id, Renewal renewalDetails) {
        Renewal renewal = renewalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Renewal not found"));

        renewal.setRenewalDate(renewalDetails.getRenewalDate());
        renewal.setNewPremium(renewalDetails.getNewPremium());
        renewal.setExpiryYear(renewalDetails.getExpiryYear());
        renewal.setStatus(renewalDetails.getStatus());

        return renewalRepository.save(renewal);
    }

    public void deleteRenewal(Long id) {
        renewalRepository.deleteById(id);
    }

    public List<Renewal> getRenewalsByStatus(Renewal.RenewalStatus status) {
        return renewalRepository.findByStatus(status);
    }
}
