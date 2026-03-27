package com.cutbook.service;

import com.cutbook.dto.SlotResponse;
import com.cutbook.model.WorkingHours;
import com.cutbook.repository.AppointmentRepository;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.WorkingHoursRepository;
import com.cutbook.service.impl.SlotServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SlotServiceTest {

    @Mock
    private WorkingHoursRepository workingHoursRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private BusinessRepository businessRepository;

    @InjectMocks
    private SlotServiceImpl slotService;

    @Test
    void getAvailableSlots_Success() {
        String dateStr = "2030-01-02";
        Long businessId = 1L;
        Integer duration = 60;

        WorkingHours mockHours = new WorkingHours();
        mockHours.setStartTime(LocalTime.of(9, 0));
        mockHours.setEndTime(LocalTime.of(12, 0));

        when(workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, "WED"))
                .thenReturn(Optional.of(mockHours));

        when(appointmentRepository.existsConflict(eq(businessId), any(LocalDateTime.class)))
                .thenReturn(false);

        SlotResponse response = slotService.getAvailableSlots(businessId, dateStr, duration);

        assertNotNull(response);
        assertEquals(3, response.getAvailableTimes().size());
        assertTrue(response.getAvailableTimes().contains("09:00"));
        assertTrue(response.getAvailableTimes().contains("11:00"));
        assertFalse(response.getAvailableTimes().contains("12:00"));
    }

    @Test
    void getAvailableSlots_WithConflicts() {
        String dateStr = "2030-01-02";
        Long businessId = 1L;
        Integer duration = 60;

        WorkingHours mockHours = new WorkingHours();
        mockHours.setStartTime(LocalTime.of(9, 0));
        mockHours.setEndTime(LocalTime.of(11, 0));

        when(workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, "WED"))
                .thenReturn(Optional.of(mockHours));

        LocalDateTime conflictTime = LocalDateTime.of(LocalDate.parse(dateStr), LocalTime.of(10, 0));
        when(appointmentRepository.existsConflict(businessId, conflictTime)).thenReturn(true);

        LocalDateTime time9 = LocalDateTime.of(LocalDate.parse(dateStr), LocalTime.of(9, 0));
        when(appointmentRepository.existsConflict(businessId, time9)).thenReturn(false);

        SlotResponse response = slotService.getAvailableSlots(businessId, dateStr, duration);

        assertEquals(1, response.getAvailableTimes().size());
        assertTrue(response.getAvailableTimes().contains("09:00"));
        assertFalse(response.getAvailableTimes().contains("10:00"));
    }
}