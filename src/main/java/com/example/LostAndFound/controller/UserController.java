package com.example.LostAndFound.controller;

import java.io.IOException;
import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.LostAndFound.dto.DashboardResponse;
import com.example.LostAndFound.dto.LoginRequest;
import com.example.LostAndFound.dto.PasswordChangeRequest;
import com.example.LostAndFound.entity.User;
// import com.example.LostAndFound.repository.UserRepository;
import com.example.LostAndFound.service.ItemService;
import com.example.LostAndFound.service.UserService;

import jakarta.validation.ConstraintViolationException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Change this to your frontend URL
public class UserController {

    private final UserService userService;
    private ItemService itemService;
    // private UserRepository userRepository;

    public UserController(UserService userService) {
        this.userService = userService;
    }

     @GetMapping("/{userId}/dashboard")
    public ResponseEntity<DashboardResponse> getUserDashboard(@PathVariable Long userId) {
        DashboardResponse dashboardData = itemService.getDashboardData(userId);
        return ResponseEntity.ok(dashboardData);
    }

    // Signup Endpoint
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {  
        // Null Check - No empty values allowed
        if (user.getFirstName() == null || user.getFirstName().trim().isEmpty() ||
            user.getLastName() == null || user.getLastName().trim().isEmpty() ||
            user.getUsername() == null || user.getUsername().trim().isEmpty() ||
            user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "All fields are required"));
        }
        
        try {
            String result = userService.registerUser(user);
            if (result.equals("User registered successfully!")) {
                return ResponseEntity.ok(Collections.singletonMap("message", result));
            } else {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", result));
            }
        } catch (ConstraintViolationException ex) {
            return handleConstraintViolation(ex);
        }
    }

    // Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty() ||
            loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email and password are required"));
        }

        User user = userService.validateUser(loginRequest.getEmail(), loginRequest.getPassword());

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid email or password"));
        }
    }

    // Get User Profile
    @GetMapping("/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        System.out.println(user.toString());
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    // Update User
    @PutMapping("/{username}")
    public ResponseEntity<Map<String, String>> updateUser(@PathVariable String username, @RequestBody User updatedUser) {
        if (updatedUser.getFirstName() == null || updatedUser.getFirstName().trim().isEmpty() ||
            updatedUser.getLastName() == null || updatedUser.getLastName().trim().isEmpty() ||
            updatedUser.getUsername() == null || updatedUser.getUsername().trim().isEmpty() ||
            updatedUser.getEmail() == null || updatedUser.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "All fields are required"));
        }

        try {
            //System.out.println("Received PUT request from frontend:");
            //System.out.println("Username (from URL): " + username);
            //System.out.println("Payload: " + updatedUser.toString());
            String result = userService.updateUser(username, updatedUser);

            if (result.equals("User not found") || 
                result.equals("Email is already taken") || 
                result.equals("Username is already taken")) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", result));
            }

            return ResponseEntity.ok(Collections.singletonMap("message", result));
        } catch (ConstraintViolationException ex) {
            return handleConstraintViolation(ex);
        }
    }

    // Handles Constraint Violations (e.g., Email format, name length)
    private ResponseEntity<Map<String, String>> handleConstraintViolation(ConstraintViolationException ex) {
        String errorMessage = ex.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                .findFirst()
                .orElse("Invalid input");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", errorMessage));
    }

    @PutMapping("/{username}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable String username, @RequestBody PasswordChangeRequest request) {
        try {
            userService.changePassword(username, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        long count = userService.count();
        return ResponseEntity.ok(count);
    }

    @PostMapping("/update-profile-picture")
    public ResponseEntity<String> updateProfilePicture(
            @RequestParam("file") MultipartFile file, 
            @RequestParam("username") String username) {

        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("No file selected");
        }

        try {
            byte[] bytes = file.getBytes();
            String encodedImage = Base64.getEncoder().encodeToString(bytes);

            boolean isUpdated = userService.updateProfilePicture(username, encodedImage);
            if (isUpdated) {
                return ResponseEntity.ok("Profile picture updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile picture");
            }

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file");
        }
    }
}
