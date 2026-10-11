package com.foodredistribution.service.impl;

import com.foodredistribution.dto.request.ChangePasswordRequest;
import com.foodredistribution.dto.request.UpdateProfileRequest;
import com.foodredistribution.dto.response.UserProfileResponse;
import com.foodredistribution.entity.FoodProviderProfile;
import com.foodredistribution.entity.NgoProfile;
import com.foodredistribution.entity.User;
import com.foodredistribution.entity.VolunteerProfile;
import com.foodredistribution.enums.Role;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.mapper.UserMapper;
import com.foodredistribution.repository.FoodProviderProfileRepository;
import com.foodredistribution.repository.NgoProfileRepository;
import com.foodredistribution.repository.UserRepository;
import com.foodredistribution.repository.VolunteerProfileRepository;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.UserService;
import com.foodredistribution.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FoodProviderProfileRepository foodProviderProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final SecurityUtils securityUtils;
    private final AuditService auditService;

    @Override
    @Transactional
    public UserProfileResponse updateProfile(UpdateProfileRequest req) {
        User user = securityUtils.getCurrentUser();
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        User savedUser = userRepository.save(user);

        FoodProviderProfile providerProfile = null;
        NgoProfile ngoProfile = null;
        VolunteerProfile volunteerProfile = null;

        if (user.getRole() == Role.FOOD_PROVIDER) {
            providerProfile = foodProviderProfileRepository.findByUser(user).orElse(null);
            if (providerProfile != null) {
                if (req.getOrganizationName() != null) providerProfile.setOrganizationName(req.getOrganizationName());
                if (req.getAddress() != null) providerProfile.setAddress(req.getAddress());
                if (req.getCity() != null) providerProfile.setCity(req.getCity());
                if (req.getState() != null) providerProfile.setState(req.getState());
                if (req.getDescription() != null) providerProfile.setDescription(req.getDescription());
                providerProfile = foodProviderProfileRepository.save(providerProfile);
            }
        } else if (user.getRole() == Role.NGO) {
            ngoProfile = ngoProfileRepository.findByUser(user).orElse(null);
            if (ngoProfile != null) {
                if (req.getOrganizationName() != null) ngoProfile.setOrganizationName(req.getOrganizationName());
                if (req.getContactPerson() != null) ngoProfile.setContactPerson(req.getContactPerson());
                if (req.getServiceArea() != null) ngoProfile.setServiceArea(req.getServiceArea());
                if (req.getAddress() != null) ngoProfile.setAddress(req.getAddress());
                if (req.getCity() != null) ngoProfile.setCity(req.getCity());
                if (req.getState() != null) ngoProfile.setState(req.getState());
                if (req.getDescription() != null) ngoProfile.setDescription(req.getDescription());
                ngoProfile = ngoProfileRepository.save(ngoProfile);
            }
        } else if (user.getRole() == Role.VOLUNTEER) {
            volunteerProfile = volunteerProfileRepository.findByUser(user).orElse(null);
            if (volunteerProfile != null) {
                if (req.getAddress() != null) volunteerProfile.setAddress(req.getAddress());
                if (req.getCity() != null) volunteerProfile.setCity(req.getCity());
                if (req.getState() != null) volunteerProfile.setState(req.getState());
                if (req.getVehicleType() != null) volunteerProfile.setVehicleType(req.getVehicleType());
                if (req.getVehicleNumber() != null) volunteerProfile.setVehicleNumber(req.getVehicleNumber());
                if (req.getAvailabilityStatus() != null) volunteerProfile.setAvailabilityStatus(req.getAvailabilityStatus());
                volunteerProfile = volunteerProfileRepository.save(volunteerProfile);
            }
        }

        auditService.logAction(savedUser, "UPDATE_PROFILE", "USER", savedUser.getId(), "User updated profile details");

        return userMapper.toUserProfileResponse(savedUser, providerProfile, ngoProfile, volunteerProfile);
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest req) {
        User user = securityUtils.getCurrentUser();

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        auditService.logAction(user, "CHANGE_PASSWORD", "USER", user.getId(), "User changed account password");
    }
}
