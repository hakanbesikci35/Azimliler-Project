package com.cutbook.controller;

import com.cutbook.dto.SlotResponse;
import com.cutbook.model.WorkingHours;
import com.cutbook.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/working-hours")
@RequiredArgsConstructor
public class WorkingHoursController {

    private final SlotService slotService;

    // FR04
    @PostMapping("/{businessId}")
    public ResponseEntity<WorkingHours> setWorkingHours(@PathVariable Long businessId, @RequestBody WorkingHours workingHours) {
        return ResponseEntity.ok(slotService.saveWorkingHours(businessId, workingHours));
    }

    // FR05 - Uygun slotlari UI tarafina dondurme
    @GetMapping("/{businessId}/slots")
    public ResponseEntity<SlotResponse> getSlots(
            @PathVariable Long businessId,
            @RequestParam String date,
            @RequestParam Integer duration) {
        return ResponseEntity.ok(slotService.getAvailableSlots(businessId, date, duration));
    }
}