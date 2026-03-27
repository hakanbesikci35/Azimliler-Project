package com.cutbook.service;

import com.cutbook.dto.SlotResponse;
import com.cutbook.model.WorkingHours;

public interface SlotService {
    WorkingHours saveWorkingHours(Long businessId, WorkingHours workingHours);
    SlotResponse getAvailableSlots(Long businessId, String dateStr, Integer serviceDurationMins);
}