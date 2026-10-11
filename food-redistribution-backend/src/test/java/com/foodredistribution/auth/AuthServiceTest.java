package com.foodredistribution.auth;

import com.foodredistribution.dto.request.LoginRequest;
import com.foodredistribution.dto.request.RegisterRequest;
import com.foodredistribution.dto.response.JwtAuthResponse;
import com.foodredistribution.dto.response.UserProfileResponse;
import com.foodredistribution.entity.FoodProviderProfile;
import com.foodredistribution.entity.User;
import com.foodredistribution.enums.OrganizationType;
import com.foodredistribution.enums.Role;
import com.foodredistribution.exception.DuplicateRequestException;
import com.foodredistribution.mapper.UserMapper;
import com.foodredistribution.repository.FoodProviderProfileRepository;
import com.foodredistribution.repository.NgoProfileRepository;
import com.foodredistribution.repository.UserRepository;
import com.foodredistribution.repository.VolunteerProfileRepository;
import com.foodredistribution.security.JwtTokenProvider;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.NotificationService;
import com.foodredistribution.service.impl.AuthServiceImpl;
import com.foodredistribution.util.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private FoodProviderProfileRepository foodProviderProfileRepository;
    @Mock
    private NgoProfileRepository ngoProfileRepository;
    @Mock
    private VolunteerProfileRepository volunteerProfileRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider tokenProvider;
    @Mock
    private UserMapper userMapper;
    @Mock
    private SecurityUtils securityUtils;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AuditService auditService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Grand Hotel")
                .email("hotel@grand.com")
                .password("encoded_pass")
                .phone("+1-555-0101")
                .role(Role.FOOD_PROVIDER)
                .enabled(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully register Food Provider and create profile")
    void testRegisterFoodProviderSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Grand Hotel");
        req.setEmail("hotel@grand.com");
        req.setPassword("Password@123");
        req.setPhone("+1-555-0101");
        req.setRole(Role.FOOD_PROVIDER);
        req.setOrganizationName("Grand Palace");
        req.setOrganizationType(OrganizationType.HOTEL);
        req.setCity("Metropolis");
        req.setState("NY");

        when(userRepository.existsByEmail("hotel@grand.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(foodProviderProfileRepository.save(any(FoodProviderProfile.class))).thenReturn(new FoodProviderProfile());
        when(userMapper.toUserProfileResponse(any(), any(), any(), any()))
                .thenReturn(UserProfileResponse.builder().id(1L).email("hotel@grand.com").role(Role.FOOD_PROVIDER).build());

        UserProfileResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("hotel@grand.com", response.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
        verify(foodProviderProfileRepository, times(1)).save(any(FoodProviderProfile.class));
    }

    @Test
    @DisplayName("Should reject registration if email already exists")
    void testRegisterDuplicateEmailThrows() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("hotel@grand.com");
        when(userRepository.existsByEmail("hotel@grand.com")).thenReturn(true);

        assertThrows(DuplicateRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully authenticate user and return JWT token")
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest();
        req.setEmail("hotel@grand.com");
        req.setPassword("Password@123");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mocked.jwt.token");
        when(userRepository.findByEmail("hotel@grand.com")).thenReturn(Optional.of(sampleUser));

        JwtAuthResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals(Role.FOOD_PROVIDER, response.getRole());
        assertEquals("hotel@grand.com", response.getEmail());
    }
}
