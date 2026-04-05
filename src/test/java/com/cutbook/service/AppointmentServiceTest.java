package com.cutbook.service;

import com.cutbook.exception.BusinessRuleException;
import com.cutbook.model.Appointment;
import com.cutbook.model.Business;
import com.cutbook.model.Service;
import com.cutbook.model.User;
import com.cutbook.repository.AppointmentRepository;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.ServiceRepository;
import com.cutbook.repository.UserRepository;
import com.cutbook.service.impl.AppointmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BusinessRepository businessRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    private User mockCustomer;
    private Business mockBusiness;
    private Service mockService;

    @BeforeEach
    void setUp() {
        mockCustomer = new User();
        mockCustomer.setId(1L);
        mockCustomer.setRole(User.Role.CUSTOMER); // bunu ekle

        mockBusiness = new Business();
        mockBusiness.setId(1L);

        mockService = new Service();
        mockService.setId(1L);
        mockService.setBusiness(mockBusiness);
    }

    @Test
    void createAppointment_Success() {
        LocalDateTime startTime = LocalDateTime.now().plusDays(1);
        LocalDateTime endTime = startTime.plusMinutes(30);

        when(appointmentRepository.existsConflict(1L, startTime)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(businessRepository.findById(1L)).thenReturn(Optional.of(mockBusiness));
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(mockService));

        Appointment savedAppointment = new Appointment();
        savedAppointment.setId(100L);
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(savedAppointment);

        Appointment result = appointmentService.createAppointment(1L, 1L, 1L, startTime, endTime, "Sac kesimi");

        assertNotNull(result);
        assertEquals(100L, result.getId());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    @Test
    void createAppointment_ThrowsException_WhenDateIsInPast() {
        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = startTime.plusMinutes(30);

        assertThrows(BusinessRuleException.class, () ->
            appointmentService.createAppointment(1L, 1L, 1L, startTime, endTime, "Gecmis randevu")
        );

        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createAppointment_ThrowsException_WhenConflictExists() {
        LocalDateTime startTime = LocalDateTime.now().plusDays(1);
        LocalDateTime endTime = startTime.plusMinutes(30);

        when(appointmentRepository.existsConflict(1L, startTime)).thenReturn(true);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () ->
            appointmentService.createAppointment(1L, 1L, 1L, startTime, endTime, "Cakisan randevu")
        );

        assertEquals("Bu saat dolu, lütfen başka bir saat seçin", ex.getMessage());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void cancelAppointment_Success() {
        Appointment appointment = new Appointment();
        appointment.setId(10L);
        appointment.setCustomer(mockCustomer);
        appointment.setStartTime(LocalDateTime.now().plusDays(1));
        appointment.setStatus(Appointment.Status.PENDING);

        when(appointmentRepository.findById(10L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

        Appointment result = appointmentService.cancelAppointment(10L, 1L);

        assertEquals(Appointment.Status.CANCELLED, result.getStatus());
    }

    @Test
    void cancelAppointment_ThrowsException_WhenNotOwner() {
        Appointment appointment = new Appointment();
        appointment.setId(10L);
        appointment.setCustomer(mockCustomer); // customer id = 1
        appointment.setStartTime(LocalDateTime.now().plusDays(1));

        when(appointmentRepository.findById(10L)).thenReturn(Optional.of(appointment));

        assertThrows(RuntimeException.class, () ->
            appointmentService.cancelAppointment(10L, 99L) // farklı kullanıcı
        );
    }

    @Test
    void cancelAppointment_ThrowsException_WhenInPast() {
        Appointment appointment = new Appointment();
        appointment.setId(10L);
        appointment.setCustomer(mockCustomer);
        appointment.setStartTime(LocalDateTime.now().minusDays(1)); // geçmiş

        when(appointmentRepository.findById(10L)).thenReturn(Optional.of(appointment));

        assertThrows(BusinessRuleException.class, () ->
            appointmentService.cancelAppointment(10L, 1L)
        );
    }

    @Test
    void getUpcomingAppointments_ReturnsCorrectList() {
        Appointment a = new Appointment();
        a.setId(1L);
        when(appointmentRepository.findByCustomerIdAndStartTimeAfter(eq(1L), any(LocalDateTime.class)))
            .thenReturn(List.of(a));

        List<Appointment> result = appointmentService.getUpcomingAppointments(1L);

        assertEquals(1, result.size());
    }

    @Test
    void getPastAppointments_ReturnsCorrectList() {
        when(appointmentRepository.findByCustomerIdAndStartTimeBefore(eq(1L), any(LocalDateTime.class)))
            .thenReturn(List.of());

        List<Appointment> result = appointmentService.getPastAppointments(1L);

        assertTrue(result.isEmpty());
    }
}