package com.foodredistribution.donation;

import com.foodredistribution.dto.response.DonationResponse;
import com.foodredistribution.entity.*;
import com.foodredistribution.enums.*;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.DonationAlreadyAcceptedException;
import com.foodredistribution.mapper.DonationMapper;
import com.foodredistribution.mapper.UserMapper;
import com.foodredistribution.repository.*;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.NotificationService;
import com.foodredistribution.service.impl.NgoServiceImpl;
import com.foodredistribution.util.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonationWorkflowIntegrationTest {

    @Mock
    private FoodDonationRepository donationRepository;
    @Mock
    private NgoProfileRepository ngoProfileRepository;
    @Mock
    private VolunteerProfileRepository volunteerProfileRepository;
    @Mock
    private DonationRequestRepository requestRepository;
    @Mock
    private PickupRepository pickupRepository;
    @Mock
    private DonationMapper donationMapper;
    @Mock
    private UserMapper userMapper;
    @Mock
    private SecurityUtils securityUtils;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AuditService auditService;

    @InjectMocks
    private NgoServiceImpl ngoService;

    private User ngoUser;
    private NgoProfile verifiedNgo;
    private FoodDonation availableDonation;

    @BeforeEach
    void setUp() {
        ngoUser = User.builder().id(20L).name("Hope NGO").email("hope@ngo.org").role(Role.NGO).build();
        verifiedNgo = NgoProfile.builder()
                .id(5L)
                .user(ngoUser)
                .organizationName("Hope NGO Foundation")
                .verificationStatus(VerificationStatus.VERIFIED)
                .address("10 Hope St")
                .city("Metropolis")
                .state("NY")
                .build();

        availableDonation = FoodDonation.builder()
                .id(100L)
                .foodName("Hot Meals")
                .foodCategory(FoodCategory.COOKED_MEALS)
                .foodType(FoodType.VEGETARIAN)
                .quantity(new BigDecimal("25.0"))
                .quantityUnit(QuantityUnit.SERVINGS)
                .status(DonationStatus.AVAILABLE)
                .pickupAddress("50 Main St")
                .city("Metropolis")
                .state("NY")
                .availableFrom(ZonedDateTime.now().minusHours(1))
                .availableUntil(ZonedDateTime.now().plusHours(4))
                .preparationDateTime(ZonedDateTime.now().minusHours(2))
                .bestBeforeDateTime(ZonedDateTime.now().plusHours(5))
                .build();
    }

    @Test
    @DisplayName("Verified NGO successfully claims available donation")
    void testClaimAvailableDonationSuccess() {
        when(securityUtils.getCurrentUser()).thenReturn(ngoUser);
        when(ngoProfileRepository.findByUser(ngoUser)).thenReturn(Optional.of(verifiedNgo));
        when(donationRepository.findById(100L)).thenReturn(Optional.of(availableDonation));
        when(requestRepository.existsByDonationAndNgo(any(), any())).thenReturn(false);
        when(donationRepository.save(any())).thenReturn(availableDonation);
        when(pickupRepository.save(any())).thenReturn(new Pickup());
        when(donationMapper.toDonationResponse(any(), any())).thenReturn(DonationResponse.builder().id(100L).status(DonationStatus.ACCEPTED).build());

        DonationResponse response = ngoService.claimDonation(100L);

        assertNotNull(response);
        assertEquals(DonationStatus.ACCEPTED, response.getStatus());
        verify(donationRepository, times(1)).save(any(FoodDonation.class));
        verify(pickupRepository, times(1)).save(any(Pickup.class));
        verify(requestRepository, times(1)).save(any(DonationRequest.class));
    }

    @Test
    @DisplayName("Should prevent multiple NGOs from accepting already claimed donation")
    void testClaimAlreadyAcceptedDonationThrows() {
        availableDonation.setStatus(DonationStatus.ACCEPTED);
        when(securityUtils.getCurrentUser()).thenReturn(ngoUser);
        when(ngoProfileRepository.findByUser(ngoUser)).thenReturn(Optional.of(verifiedNgo));
        when(donationRepository.findById(100L)).thenReturn(Optional.of(availableDonation));

        assertThrows(DonationAlreadyAcceptedException.class, () -> ngoService.claimDonation(100L));
        verify(pickupRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should reject claim if donation has expired")
    void testClaimExpiredDonationThrows() {
        availableDonation.setAvailableUntil(ZonedDateTime.now().minusMinutes(10));
        when(securityUtils.getCurrentUser()).thenReturn(ngoUser);
        when(ngoProfileRepository.findByUser(ngoUser)).thenReturn(Optional.of(verifiedNgo));
        when(donationRepository.findById(100L)).thenReturn(Optional.of(availableDonation));

        assertThrows(BadRequestException.class, () -> ngoService.claimDonation(100L));
    }
}
