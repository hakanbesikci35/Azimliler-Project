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
        // 09:00 - 11:00, 60 dk hizmet, 30 dk slot aralığı
        // Slotlar: 09:00, 09:30, 10:00 → 3 slot (her biri 60 dk sığıyor)
        // 10:30 sığmaz çünkü 10:30+60=11:30 > 11:00
        String dateStr = "2030-01-02";
        Long businessId = 1L;
        Integer duration = 60;

        WorkingHours mockHours = new WorkingHours();
        mockHours.setStartTime(LocalTime.of(9, 0));
        mockHours.setEndTime(LocalTime.of(11, 0));

        when(workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, "WED"))
                .thenReturn(Optional.of(mockHours));

        when(appointmentRepository.existsRangeConflict(eq(businessId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(false);

        SlotResponse response = slotService.getAvailableSlots(businessId, dateStr, duration);

        assertNotNull(response);
        assertEquals(3, response.getAvailableTimes().size());
        assertTrue(response.getAvailableTimes().contains("09:00"));
        assertTrue(response.getAvailableTimes().contains("09:30"));
        assertTrue(response.getAvailableTimes().contains("10:00"));
        assertFalse(response.getAvailableTimes().contains("10:30")); // 10:30+60=11:30 aşıyor
    }

    @Test
    void getAvailableSlots_WithConflicts() {
        // 09:00 - 11:00, 60 dk hizmet
        // 09:00-10:00 çakışıyor → 09:00 ve 09:30 kullanılamaz
        // 10:00 müsait
        String dateStr = "2030-01-02";
        Long businessId = 1L;
        Integer duration = 60;

        WorkingHours mockHours = new WorkingHours();
        mockHours.setStartTime(LocalTime.of(9, 0));
        mockHours.setEndTime(LocalTime.of(11, 0));

        when(workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, "WED"))
                .thenReturn(Optional.of(mockHours));

        LocalDate date = LocalDate.parse(dateStr);

        // 09:00-10:00 aralığında çakışma var
        when(appointmentRepository.existsRangeConflict(
                eq(businessId),
                eq(LocalDateTime.of(date, LocalTime.of(9, 0))),
                eq(LocalDateTime.of(date, LocalTime.of(10, 0)))))
                .thenReturn(true);

        // 09:30-10:30 aralığında çakışma var
        when(appointmentRepository.existsRangeConflict(
                eq(businessId),
                eq(LocalDateTime.of(date, LocalTime.of(9, 30))),
                eq(LocalDateTime.of(date, LocalTime.of(10, 30)))))
                .thenReturn(true);

        // 10:00-11:00 müsait
        when(appointmentRepository.existsRangeConflict(
                eq(businessId),
                eq(LocalDateTime.of(date, LocalTime.of(10, 0))),
                eq(LocalDateTime.of(date, LocalTime.of(11, 0)))))
                .thenReturn(false);

        SlotResponse response = slotService.getAvailableSlots(businessId, dateStr, duration);

        assertEquals(1, response.getAvailableTimes().size());
        assertTrue(response.getAvailableTimes().contains("10:00"));
        assertFalse(response.getAvailableTimes().contains("09:00"));
        assertFalse(response.getAvailableTimes().contains("09:30"));
    }

    @Test
    void getAvailableSlots_HolidayDay_ReturnsEmpty() {
        String dateStr = "2030-01-02";
        Long businessId = 1L;

        WorkingHours mockHours = new WorkingHours();
        mockHours.setStartTime(LocalTime.MIDNIGHT);
        mockHours.setEndTime(LocalTime.MIDNIGHT);

        when(workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, "WED"))
                .thenReturn(Optional.of(mockHours));

        SlotResponse response = slotService.getAvailableSlots(businessId, dateStr, 60);

        assertNotNull(response);
        assertTrue(response.getAvailableTimes().isEmpty());
    }

    @Test
    void getAvailableSlots_ThrowsException_WhenNoWorkingHours() {
        when(workingHoursRepository.findByBusinessIdAndDayOfWeek(any(), any()))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                slotService.getAvailableSlots(1L, "2030-01-02", 60)
        );
    }
}