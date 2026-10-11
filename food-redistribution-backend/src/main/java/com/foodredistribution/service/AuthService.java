package com.foodredistribution.service;

import com.foodredistribution.dto.request.LoginRequest;
import com.foodredistribution.dto.request.RegisterRequest;
import com.foodredistribution.dto.response.JwtAuthResponse;
import com.foodredistribution.dto.response.UserProfileResponse;

public interface AuthService {
    JwtAuthResponse login(LoginRequest loginRequest);
    UserProfileResponse register(RegisterRequest registerRequest);
    UserProfileResponse getCurrentUserProfile();
}
