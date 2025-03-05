package com.example.LostAndFound.service;

import com.example.LostAndFound.entity.User;
import com.example.LostAndFound.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Use PasswordEncoder instead of BCryptPasswordEncoder

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String registerUser(User user) {
        // Check if email already exists
        Optional<User> existingUserByEmail = userRepository.findByEmail(user.getEmail());
        if (existingUserByEmail.isPresent()) {
            return "Email is already in use!";
        }

        // Check if username already exists
        Optional<User> existingUserByUsername = userRepository.findByUsername(user.getUsername());
        if (existingUserByUsername.isPresent()) {
            return "Username is already taken!";
        }

        // Hash the password before saving
        // comment this out to prevent hashing
        user.setPassword(passwordEncoder.encode(user.getPassword())); //hashes user_password

        // Save the user
        userRepository.save(user);
        return "User registered successfully!";
    }

    public User validateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // Check if the password matches the stored hashed password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user; // Successful login
            }
        }
        
        return null; // Invalid credentials
    }
    
}
