package com.cutbook.service;

import com.cutbook.model.Appointment;
import com.cutbook.model.Business;
import com.cutbook.model.User;
import com.cutbook.repository.AppointmentRepository;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// AppointmentService is kurallari birim testleri
@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BusinessRepository businessRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private User mockCustomer;
    private Business mockBusiness;

    @BeforeEach
    void setUp() {
        mockCustomer = new User();
        mockCustomer.setId(1L);

        mockBusiness = new Business();
        mockBusiness.setId(1L);
    }

    // Basarili randevu olusturma testi
    @Test
    void createAppointment_Success() {
        LocalDateTime startTime = LocalDateTime.now().plusDays(1);
        LocalDateTime endTime = startTime.plusMinutes(30);

        when(appointmentRepository.existsConflict(1L, startTime)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(businessRepository.findById(1L)).thenReturn(Optional.of(mockBusiness));

        Appointment savedAppointment = new Appointment();
        savedAppointment.setId(100L);
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(savedAppointment);

        Appointment result = appointmentService.createAppointment(1L, 1L, 1L, startTime, endTime, "Sac kesimi");

        assertNotNull(result);
        assertEquals(100L, result.getId());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    // Gecmis tarihe randevu alinmak istendiginde hata firlatma testi
    @Test
    void createAppointment_ThrowsException_WhenDateIsInPast() {
        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = startTime.plusMinutes(30);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            appointmentService.createAppointment(1L, 1L, 1L, startTime, endTime, "Gecmis randevu");
        });

        assertEquals("Geçmiş bir tarihe randevu oluşturamazsınız", exception.getMessage());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    // Ayni saate (cakisan) randevu alinmak istendiginde hata firlatma testi
    @Test
    void createAppointment_ThrowsException_WhenConflictExists() {
        LocalDateTime startTime = LocalDateTime.now().plusDays(1);
        LocalDateTime endTime = startTime.plusMinutes(30);

        when(appointmentRepository.existsConflict(1L, startTime)).thenReturn(true);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            appointmentService.createAppointment(1L, 1L, 1L, startTime, endTime, "Cakisan randevu");
        });

        assertEquals("Bu saat dolu, lütfen başka bir saat seçin", exception.getMessage());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }
}