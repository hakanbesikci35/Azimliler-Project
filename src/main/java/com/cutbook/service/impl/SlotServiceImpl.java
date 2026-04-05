package com.cutbook.service.impl;

import com.cutbook.dto.SlotResponse;
import com.cutbook.model.WorkingHours;
import com.cutbook.repository.AppointmentRepository;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.WorkingHoursRepository;
import com.cutbook.service.SlotService;
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
public class SlotServiceImpl implements SlotService {

    private final WorkingHoursRepository workingHoursRepository;
    private final AppointmentRepository appointmentRepository;
    private final BusinessRepository businessRepository;

    @Override
    public WorkingHours saveWorkingHours(Long businessId, WorkingHours workingHours) {
        businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Isletme bulunamadi"));

        // Aynı gün için kayıt varsa güncelle (upsert)
        WorkingHours existing = workingHoursRepository
                .findByBusinessIdAndDayOfWeek(businessId, workingHours.getDayOfWeek())
                .orElse(null);

        if (existing != null) {
            existing.setStartTime(workingHours.getStartTime());
            existing.setEndTime(workingHours.getEndTime());
            return workingHoursRepository.save(existing);
        }

        workingHours.setBusiness(businessRepository.getReferenceById(businessId));
        return workingHoursRepository.save(workingHours);
    }

    private static final int SLOT_INTERVAL_MINS = 30;

@Override
public SlotResponse getAvailableSlots(Long businessId, String dateStr, Integer serviceDurationMins) {
    LocalDate date = LocalDate.parse(dateStr);
    String dayOfWeek = date.getDayOfWeek().name().substring(0, 3);

    if (dayOfWeek.equals("THU")) {
        dayOfWeek = "THURS";
    }

    WorkingHours hours = workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, dayOfWeek)
            .orElseThrow(() -> new RuntimeException("Seçilen gün için çalışma saati bulunamadı"));

    if (hours.getStartTime().equals(LocalTime.MIDNIGHT) && hours.getEndTime().equals(LocalTime.MIDNIGHT)) {
    return new SlotResponse(dateStr, new ArrayList<>());
}

    List<String> availableTimes = new ArrayList<>();
    LocalTime currentTime = hours.getStartTime();
    LocalTime endTime = hours.getEndTime();

    while (true) {
        LocalTime slotEnd = currentTime.plusMinutes(serviceDurationMins);

        if (slotEnd.isAfter(endTime)) break;

        LocalDateTime slotStart = LocalDateTime.of(date, currentTime);
        LocalDateTime slotEndDt = LocalDateTime.of(date, slotEnd);

        if (slotStart.isAfter(LocalDateTime.now())) {
            boolean hasConflict = appointmentRepository.existsRangeConflict(businessId, slotStart, slotEndDt);
            if (!hasConflict) {
                availableTimes.add(currentTime.format(DateTimeFormatter.ofPattern("HH:mm")));
            }
        }

        currentTime = currentTime.plusMinutes(SLOT_INTERVAL_MINS);
    }

    return new SlotResponse(dateStr, availableTimes);
    }
}