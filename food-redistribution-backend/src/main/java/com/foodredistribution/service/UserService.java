package com.foodredistribution.service;

import com.foodredistribution.dto.request.ChangePasswordRequest;
import com.foodredistribution.dto.request.UpdateProfileRequest;
import com.foodredistribution.dto.response.UserProfileResponse;

public interface UserService {
    UserProfileResponse updateProfile(UpdateProfileRequest request);
    void changePassword(ChangePasswordRequest request);
}
