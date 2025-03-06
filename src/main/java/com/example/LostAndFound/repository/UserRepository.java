package com.example.LostAndFound.repository;

import com.example.LostAndFound.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);   // Check if email exists
    Optional<User> findByUsername(String username);  // Check if username exists
    long count();
}
