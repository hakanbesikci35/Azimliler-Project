package com.cutbook.service;

import com.cutbook.dto.SlotResponse;
import com.cutbook.model.WorkingHours;
import com.cutbook.repository.AppointmentRepository;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.WorkingHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final WorkingHoursRepository workingHoursRepository;
    private final AppointmentRepository appointmentRepository;
    private final BusinessRepository businessRepository;

    // Isletme calisma saatlerini kaydetme (FR04)
    public WorkingHours saveWorkingHours(Long businessId, WorkingHours workingHours) {
        businessRepository.findById(businessId).orElseThrow(() -> new RuntimeException("Isletme bulunamadi"));
        workingHours.setBusiness(businessRepository.getReferenceById(businessId));
        return workingHoursRepository.save(workingHours);
    }

    // Isletmenin belirtilen tarihteki bos saatlerini hesaplama (FR05)
    public SlotResponse getAvailableSlots(Long businessId, String dateStr, Integer serviceDurationMins) {
        LocalDate date = LocalDate.parse(dateStr);
        String dayOfWeek = date.getDayOfWeek().name().substring(0, 3); // Ornek: MON, TUE

        WorkingHours hours = workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, dayOfWeek)
                .orElseThrow(() -> new RuntimeException("Secilen gun icin calisma saati bulunamadi"));

        List<String> availableTimes = new ArrayList<>();
        LocalTime currentTime = hours.getStartTime();
        LocalTime endTime = hours.getEndTime();

        // Baslangictan bitise kadar hizmet suresi kadar arttirarak slot uret
        while (currentTime.plusMinutes(serviceDurationMins).isBefore(endTime) || currentTime.plusMinutes(serviceDurationMins).equals(endTime)) {
            LocalDateTime slotStart = LocalDateTime.of(date, currentTime);

            // Veritabaninda bu slot icin PENDING randevu var mi kontrolu (FR06)
            boolean isConflict = appointmentRepository.existsConflict(businessId, slotStart);

            // Gecmis saati gostermemek icin kontrol
            if (!isConflict && slotStart.isAfter(LocalDateTime.now())) {
                availableTimes.add(currentTime.format(DateTimeFormatter.ofPattern("HH:mm")));
            }
            currentTime = currentTime.plusMinutes(serviceDurationMins);
        }

        return new SlotResponse(dateStr, availableTimes);
    }
}