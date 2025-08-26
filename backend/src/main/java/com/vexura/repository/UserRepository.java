package com.vexura.repository;

import com.vexura.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByCustomerId(String customerId);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findByCity(String city);
    
    boolean existsByEmail(String email);
    
    boolean existsByCustomerId(String customerId);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.city = :city")
    List<User> findByRoleAndCity(@Param("role") User.UserRole role, @Param("city") String city);
}
