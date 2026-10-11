package com.foodredistribution.service.impl;

import com.foodredistribution.dto.request.LoginRequest;

import com.foodredistribution.dto.request.RegisterRequest;
import com.foodredistribution.dto.response.JwtAuthResponse;
import com.foodredistribution.dto.response.UserProfileResponse;
import com.foodredistribution.entity.FoodProviderProfile;
import com.foodredistribution.entity.NgoProfile;
import com.foodredistribution.entity.User;
import com.foodredistribution.entity.VolunteerProfile;
import com.foodredistribution.enums.*;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.DuplicateRequestException;
import com.foodredistribution.mapper.UserMapper;
import com.foodredistribution.repository.FoodProviderProfileRepository;
import com.foodredistribution.repository.NgoProfileRepository;
import com.foodredistribution.repository.UserRepository;
import com.foodredistribution.repository.VolunteerProfileRepository;
import com.foodredistribution.security.JwtTokenProvider;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.AuthService;
import com.foodredistribution.service.NotificationService;
import com.foodredistribution.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final FoodProviderProfileRepository foodProviderProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Override
    public JwtAuthResponse login(LoginRequest loginRequest) {
        log.info("Attempting login for email: {}", loginRequest.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String verificationStatus = "APPROVED";
        if (user.getRole() == Role.NGO) {
            verificationStatus = ngoProfileRepository.findByUser(user)
                    .map(p -> p.getVerificationStatus().name())
                    .orElse("PENDING");
        } else if (user.getRole() == Role.VOLUNTEER) {
            verificationStatus = volunteerProfileRepository.findByUser(user)
                    .map(p -> p.getVerificationStatus().name())
                    .orElse("PENDING");
        }

        auditService.logAction(user, "LOGIN", "USER", user.getId(), "User logged in successfully");

        return JwtAuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .verificationStatus(verificationStatus)
                .build();
    }

    @Override
    @Transactional
    public UserProfileResponse register(RegisterRequest req) {
        log.info("Attempting registration for email: {} with role: {}", req.getEmail(), req.getRole());

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateRequestException("Email address is already registered: " + req.getEmail());
        }

        if (req.getRole() == Role.ADMIN) {
            throw new BadRequestException("Direct registration for ADMIN role is not permitted.");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(req.getRole())
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        FoodProviderProfile providerProfile = null;
        NgoProfile ngoProfile = null;
        VolunteerProfile volunteerProfile = null;

        switch (req.getRole()) {
            case FOOD_PROVIDER:
                providerProfile = FoodProviderProfile.builder()
                        .user(savedUser)
                        .organizationName(req.getOrganizationName() != null ? req.getOrganizationName() : req.getName())
                        .organizationType(req.getOrganizationType() != null ? req.getOrganizationType() : OrganizationType.RESTAURANT)
                        .address(req.getAddress() != null ? req.getAddress() : "Default Address")
                        .city(req.getCity() != null ? req.getCity() : "Metropolis")
                        .state(req.getState() != null ? req.getState() : "NY")
                        .description(req.getDescription())
                        .verificationStatus(VerificationStatus.APPROVED)
                        .build();
                providerProfile = foodProviderProfileRepository.save(providerProfile);
                break;

            case NGO:
                if (req.getRegistrationNumber() != null && ngoProfileRepository.existsByRegistrationNumber(req.getRegistrationNumber())) {
                    throw new DuplicateRequestException("Registration number already in use: " + req.getRegistrationNumber());
                }
                ngoProfile = NgoProfile.builder()
                        .user(savedUser)
                        .organizationName(req.getOrganizationName() != null ? req.getOrganizationName() : req.getName())
                        .registrationNumber(req.getRegistrationNumber() != null ? req.getRegistrationNumber() : "REG-" + System.currentTimeMillis())
                        .contactPerson(req.getContactPerson() != null ? req.getContactPerson() : req.getName())
                        .address(req.getAddress() != null ? req.getAddress() : "Headquarters Address")
                        .city(req.getCity() != null ? req.getCity() : "Metropolis")
                        .state(req.getState() != null ? req.getState() : "NY")
                        .serviceArea(req.getServiceArea() != null ? req.getServiceArea() : "City Wide")
                        .description(req.getDescription())
                        .verificationStatus(VerificationStatus.PENDING)
                        .build();
                ngoProfile = ngoProfileRepository.save(ngoProfile);
                break;

            case VOLUNTEER:
                volunteerProfile = VolunteerProfile.builder()
                        .user(savedUser)
                        .address(req.getAddress() != null ? req.getAddress() : "Home Address")
                        .city(req.getCity() != null ? req.getCity() : "Metropolis")
                        .state(req.getState() != null ? req.getState() : "NY")
                        .vehicleType(req.getVehicleType() != null ? req.getVehicleType() : VehicleType.BIKE)
                        .vehicleNumber(req.getVehicleNumber())
                        .availabilityStatus(VolunteerAvailability.AVAILABLE)
                        .verificationStatus(VerificationStatus.PENDING)
                        .build();
                volunteerProfile = volunteerProfileRepository.save(volunteerProfile);
                break;

            default:
                break;
        }

        notificationService.createNotification(savedUser,
                "Welcome to FoodShare",
                "Your account has been created successfully. Welcome to the Food Waste Redistribution network!",
                "SYSTEM");

        auditService.logAction(savedUser, "REGISTER", "USER", savedUser.getId(),
                "User registered with role: " + savedUser.getRole());

        return userMapper.toUserProfileResponse(savedUser, providerProfile, ngoProfile, volunteerProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        User user = securityUtils.getCurrentUser();
        FoodProviderProfile providerProfile = foodProviderProfileRepository.findByUser(user).orElse(null);
        NgoProfile ngoProfile = ngoProfileRepository.findByUser(user).orElse(null);
        VolunteerProfile volunteerProfile = volunteerProfileRepository.findByUser(user).orElse(null);

        return userMapper.toUserProfileResponse(user, providerProfile, ngoProfile, volunteerProfile);
    }
}
