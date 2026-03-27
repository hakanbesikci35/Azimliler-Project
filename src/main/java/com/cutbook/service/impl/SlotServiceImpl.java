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
        businessRepository.findById(businessId).orElseThrow(() -> new RuntimeException("Isletme bulunamadi"));
        workingHours.setBusiness(businessRepository.getReferenceById(businessId));
        return workingHoursRepository.save(workingHours);
    }

    @Override
    public SlotResponse getAvailableSlots(Long businessId, String dateStr, Integer serviceDurationMins) {
        LocalDate date = LocalDate.parse(dateStr);
        String dayOfWeek = date.getDayOfWeek().name().substring(0, 3);

        if (dayOfWeek.equals("THU")) {
            dayOfWeek = "THURS";
        }

        WorkingHours hours = workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, dayOfWeek)
                .orElseThrow(() -> new RuntimeException("Secilen gun icin calisma saati bulunamadi"));

        List<String> availableTimes = new ArrayList<>();
        LocalTime currentTime = hours.getStartTime();
        LocalTime endTime = hours.getEndTime();

        while (currentTime.plusMinutes(serviceDurationMins).isBefore(endTime) || currentTime.plusMinutes(serviceDurationMins).equals(endTime)) {
            LocalDateTime slotStart = LocalDateTime.of(date, currentTime);
            boolean isConflict = appointmentRepository.existsConflict(businessId, slotStart);

            if (!isConflict && slotStart.isAfter(LocalDateTime.now())) {
                availableTimes.add(currentTime.format(DateTimeFormatter.ofPattern("HH:mm")));
            }
            currentTime = currentTime.plusMinutes(serviceDurationMins);
        }

        return new SlotResponse(dateStr, availableTimes);
    }
}