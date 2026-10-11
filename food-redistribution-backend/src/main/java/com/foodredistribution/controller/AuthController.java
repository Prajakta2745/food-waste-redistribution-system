package com.foodredistribution.controller;

import com.foodredistribution.dto.request.LoginRequest;
import com.foodredistribution.dto.request.RegisterRequest;
import com.foodredistribution.dto.response.ApiResponse;
import com.foodredistribution.dto.response.JwtAuthResponse;
import com.foodredistribution.dto.response.UserProfileResponse;
import com.foodredistribution.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, and token issuance")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new User with profile (Food Provider, NGO, or Volunteer)")
    public ResponseEntity<ApiResponse<UserProfileResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UserProfileResponse userProfile = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User registered successfully", userProfile));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser() {
        UserProfileResponse userProfile = authService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.ok("Current user profile retrieved", userProfile));
    }
}
