package com.cutbook.service;

import com.cutbook.dto.SlotResponse;
import com.cutbook.model.WorkingHours;
import com.cutbook.repository.AppointmentRepository;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.WorkingHoursRepository;
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

// SlotService uygunluk ve cakisma is kurallari testleri
@ExtendWith(MockitoExtension.class)
class SlotServiceTest {

    @Mock
    private WorkingHoursRepository workingHoursRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private BusinessRepository businessRepository;

    @InjectMocks
    private SlotService slotService;

    // Uygun slotlarin basariyla hesaplanmasi testi
    @Test
    void getAvailableSlots_Success() {
        String dateStr = "2030-01-02"; // Gelecek bir tarih (WED)
        Long businessId = 1L;
        Integer duration = 60; // 60 dakika

        WorkingHours mockHours = new WorkingHours();
        mockHours.setStartTime(LocalTime.of(9, 0));
        mockHours.setEndTime(LocalTime.of(12, 0));
        // Dogru Beklenen slotlar: 09:00, 10:00, 11:00 (Toplam 3 adet)
        // 12:00'da baslayan randevu 13:00'da biter, mesai disina ciktigi icin listeye alinmaz.

        when(workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, "WED"))
                .thenReturn(Optional.of(mockHours));

        when(appointmentRepository.existsConflict(eq(businessId), any(LocalDateTime.class)))
                .thenReturn(false);

        SlotResponse response = slotService.getAvailableSlots(businessId, dateStr, duration);

        assertNotNull(response);
        assertEquals(3, response.getAvailableTimes().size()); // 4 yerine 3 olmali
        assertTrue(response.getAvailableTimes().contains("09:00"));
        assertTrue(response.getAvailableTimes().contains("11:00"));
        assertFalse(response.getAvailableTimes().contains("12:00")); // 12:00 olmamali
    }

    // Cakisan randevularin slot listesinden cikarilmasi testi
    @Test
    void getAvailableSlots_WithConflicts() {
        String dateStr = "2030-01-02";
        Long businessId = 1L;
        Integer duration = 60;

        WorkingHours mockHours = new WorkingHours();
        mockHours.setStartTime(LocalTime.of(9, 0));
        mockHours.setEndTime(LocalTime.of(11, 0));
        // Orijinal slotlar: Sadece 09:00 ve 10:00'dir.

        when(workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, "WED"))
                .thenReturn(Optional.of(mockHours));

        // 10:00 slotu icin cakisma var (dolu) durumu simule ediliyor
        LocalDateTime conflictTime = LocalDateTime.of(LocalDate.parse(dateStr), LocalTime.of(10, 0));
        when(appointmentRepository.existsConflict(businessId, conflictTime)).thenReturn(true);

        // 09:00 slotu bos
        LocalDateTime time9 = LocalDateTime.of(LocalDate.parse(dateStr), LocalTime.of(9, 0));
        when(appointmentRepository.existsConflict(businessId, time9)).thenReturn(false);

        SlotResponse response = slotService.getAvailableSlots(businessId, dateStr, duration);

        assertEquals(1, response.getAvailableTimes().size()); // Sadece 09:00 kaldigi icin 1 olmali
        assertTrue(response.getAvailableTimes().contains("09:00"));
        assertFalse(response.getAvailableTimes().contains("10:00")); // Cakisan slot elenmis olmali
    }
}