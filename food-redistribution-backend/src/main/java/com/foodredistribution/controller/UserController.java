package com.foodredistribution.controller;

import com.foodredistribution.dto.request.ChangePasswordRequest;
import com.foodredistribution.dto.request.UpdateProfileRequest;
import com.foodredistribution.dto.response.ApiResponse;
import com.foodredistribution.dto.response.UserProfileResponse;
import com.foodredistribution.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "Endpoints for managing user profile and security")
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile details")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse response = userService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change current user account password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", null));
    }
}
