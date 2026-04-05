package com.cutbook.service;

import com.cutbook.dto.BusinessDto;
import com.cutbook.dto.ServiceDto;
import com.cutbook.exception.ResourceNotFoundException;
import com.cutbook.model.Business;
import com.cutbook.model.User;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.ServiceRepository;
import com.cutbook.repository.UserRepository;
import com.cutbook.service.impl.BusinessServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessServiceTest {

    @Mock private BusinessRepository businessRepository;
    @Mock private UserRepository userRepository;
    @Mock private ServiceRepository serviceRepository;

    @InjectMocks
    private BusinessServiceImpl businessService;

    private User mockOwner;
    private Business mockBusiness;

    @BeforeEach
    void setUp() {
        mockOwner = new User();
        mockOwner.setId(1L);
        mockOwner.setEmail("owner@salon.com");
        mockOwner.setRole(User.Role.OWNER);

        mockBusiness = new Business();
        mockBusiness.setId(1L);
        mockBusiness.setName("Test Salon");
        mockBusiness.setOwner(mockOwner);
    }

    // --- CREATE ---

    @Test
    void createBusiness_Success() {
        BusinessDto dto = new BusinessDto();
        dto.setOwnerId(1L);
        dto.setName("Test Salon");
        dto.setDescription("Açıklama");
        dto.setPhone("05001234567");
        dto.setAddress("İstanbul");

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockOwner));
        when(businessRepository.save(any(Business.class))).thenReturn(mockBusiness);

        Business result = businessService.createBusiness(dto);

        assertNotNull(result);
        assertEquals("Test Salon", result.getName());
        verify(businessRepository).save(any(Business.class));
    }

    @Test
    void createBusiness_ThrowsException_WhenOwnerNotFound() {
        BusinessDto dto = new BusinessDto();
        dto.setOwnerId(99L);
        dto.setName("Ghost Salon");

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> businessService.createBusiness(dto));
        verify(businessRepository, never()).save(any());
    }

    // --- GET ALL ---

    @Test
    void getAllBusinesses_ReturnsAllBusinesses() {
        Business b2 = new Business();
        b2.setId(2L);
        b2.setName("Salon 2");

        when(businessRepository.findAll()).thenReturn(List.of(mockBusiness, b2));

        List<Business> result = businessService.getAllBusinesses();

        assertEquals(2, result.size());
    }

    @Test
    void getAllBusinesses_ReturnsEmptyList_WhenNoneExist() {
        when(businessRepository.findAll()).thenReturn(List.of());

        List<Business> result = businessService.getAllBusinesses();

        assertTrue(result.isEmpty());
    }

    // --- GET BY ID ---

    @Test
    void getBusinessById_Success() {
        when(businessRepository.findById(1L)).thenReturn(Optional.of(mockBusiness));

        Business result = businessService.getBusinessById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getBusinessById_ThrowsException_WhenNotFound() {
        when(businessRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> businessService.getBusinessById(999L));
    }

    // --- UPDATE ---

    @Test
    void updateBusiness_Success() {
        BusinessDto dto = new BusinessDto();
        dto.setName("Güncel Salon");
        dto.setDescription("Yeni açıklama");
        dto.setPhone("05559999999");
        dto.setAddress("Ankara");

        when(businessRepository.findById(1L)).thenReturn(Optional.of(mockBusiness));
        when(businessRepository.save(any(Business.class))).thenAnswer(i -> i.getArgument(0));

        Business result = businessService.updateBusiness(1L, dto);

        assertEquals("Güncel Salon", result.getName());
        assertEquals("Ankara", result.getAddress());
    }

    // --- ADD SERVICE ---

    @Test
    void addServiceToBusiness_Success() {
        ServiceDto dto = new ServiceDto();
        dto.setName("Saç Kesimi");
        dto.setDurationMinutes(30);
        dto.setPrice(new BigDecimal("150.00"));

        com.cutbook.model.Service mockService = new com.cutbook.model.Service();
        mockService.setId(1L);
        mockService.setName("Saç Kesimi");
        mockService.setBusiness(mockBusiness);
        mockService.setDurationMinutes(30);
        mockService.setPrice(new BigDecimal("150.00"));

        when(businessRepository.findById(1L)).thenReturn(Optional.of(mockBusiness));
        when(serviceRepository.save(any(com.cutbook.model.Service.class))).thenReturn(mockService);

        com.cutbook.model.Service result = businessService.addServiceToBusiness(1L, dto);

        assertNotNull(result);
        assertEquals("Saç Kesimi", result.getName());
        assertEquals(30, result.getDurationMinutes());
        verify(serviceRepository).save(any(com.cutbook.model.Service.class));
    }

    @Test
    void addServiceToBusiness_ThrowsException_WhenBusinessNotFound() {
        ServiceDto dto = new ServiceDto();
        dto.setName("Saç Kesimi");
        dto.setDurationMinutes(30);

        when(businessRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> businessService.addServiceToBusiness(99L, dto));
        verify(serviceRepository, never()).save(any());
    }

    // --- GET SERVICES ---

    @Test
    void getBusinessServices_ReturnsServices() {
        com.cutbook.model.Service s = new com.cutbook.model.Service();
        s.setId(1L);
        s.setName("Saç Boyama");

        when(serviceRepository.findByBusinessId(1L)).thenReturn(List.of(s));

        List<com.cutbook.model.Service> result = businessService.getBusinessServices(1L);

        assertEquals(1, result.size());
        assertEquals("Saç Boyama", result.get(0).getName());
    }
}
