package com.foodredistribution.pickup;

import com.foodredistribution.dto.response.PickupResponse;
import com.foodredistribution.entity.*;
import com.foodredistribution.enums.*;
import com.foodredistribution.mapper.DonationMapper;
import com.foodredistribution.repository.FoodDonationRepository;
import com.foodredistribution.repository.PickupRepository;
import com.foodredistribution.repository.VolunteerProfileRepository;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.NotificationService;
import com.foodredistribution.service.impl.VolunteerServiceImpl;
import com.foodredistribution.util.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PickupLifecycleTest {

    @Mock
    private VolunteerProfileRepository volunteerProfileRepository;
    @Mock
    private PickupRepository pickupRepository;
    @Mock
    private FoodDonationRepository donationRepository;
    @Mock
    private DonationMapper donationMapper;
    @Mock
    private SecurityUtils securityUtils;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AuditService auditService;

    @InjectMocks
    private VolunteerServiceImpl volunteerService;

    private User volUser;
    private VolunteerProfile volunteer;
    private FoodDonation donation;
    private Pickup pickup;

    @BeforeEach
    void setUp() {
        volUser = User.builder().id(30L).name("Volunteer Alex").email("alex@volunteer.com").role(Role.VOLUNTEER).build();
        volunteer = VolunteerProfile.builder()
                .id(10L)
                .user(volUser)
                .verificationStatus(VerificationStatus.VERIFIED)
                .availabilityStatus(VolunteerAvailability.AVAILABLE)
                .build();

        donation = FoodDonation.builder().id(200L).foodName("Pastries").status(DonationStatus.PICKUP_ASSIGNED).build();
        pickup = Pickup.builder()
                .id(50L)
                .donation(donation)
                .volunteer(volunteer)
                .status(PickupStatus.ASSIGNED)
                .build();
    }

    @Test
    @DisplayName("Volunteer accepts assigned pickup")
    void testAcceptPickup() {
        when(securityUtils.getCurrentUser()).thenReturn(volUser);
        when(volunteerProfileRepository.findByUser(volUser)).thenReturn(Optional.of(volunteer));
        when(pickupRepository.findById(50L)).thenReturn(Optional.of(pickup));
        when(pickupRepository.save(any())).thenReturn(pickup);
        when(donationMapper.toPickupResponse(any())).thenReturn(PickupResponse.builder().id(50L).status(PickupStatus.ACCEPTED).build());

        PickupResponse res = volunteerService.acceptPickup(50L);

        assertNotNull(res);
        assertEquals(PickupStatus.ACCEPTED, res.getStatus());
        verify(pickupRepository, times(1)).save(any(Pickup.class));
    }

    @Test
    @DisplayName("Volunteer transitions status to PICKED_UP")
    void testUpdateStatusToPickedUp() {
        pickup.setStatus(PickupStatus.ACCEPTED);
        when(securityUtils.getCurrentUser()).thenReturn(volUser);
        when(volunteerProfileRepository.findByUser(volUser)).thenReturn(Optional.of(volunteer));
        when(pickupRepository.findById(50L)).thenReturn(Optional.of(pickup));
        when(donationRepository.save(any())).thenReturn(donation);
        when(pickupRepository.save(any())).thenReturn(pickup);
        when(donationMapper.toPickupResponse(any())).thenReturn(PickupResponse.builder().id(50L).status(PickupStatus.PICKED_UP).build());

        PickupResponse res = volunteerService.updatePickupStatus(50L, PickupStatus.PICKED_UP, "Collected on time");

        assertNotNull(res);
        assertEquals(PickupStatus.PICKED_UP, res.getStatus());
        verify(donationRepository, times(1)).save(any(FoodDonation.class));
        verify(pickupRepository, times(1)).save(any(Pickup.class));
    }
}
