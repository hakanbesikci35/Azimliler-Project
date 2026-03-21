package com.cutbook.controller;

import com.cutbook.model.Appointment;
import com.cutbook.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Randevu oluştur
    @PostMapping
    public ResponseEntity<Appointment> create(
            @RequestParam Long customerId,
            @RequestParam Long businessId,
            @RequestParam Long serviceId,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam(required = false) String notes) {

        Appointment appointment = appointmentService.createAppointment(
            customerId, businessId, serviceId,
            LocalDateTime.parse(startTime),
            LocalDateTime.parse(endTime),
            notes
        );
        return ResponseEntity.ok(appointment);
    }

    // Müşterinin tüm randevuları
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Appointment>> getCustomerAppointments(@PathVariable Long customerId) {
        return ResponseEntity.ok(appointmentService.getCustomerAppointments(customerId));
    }

    // Müşterinin gelecek randevuları
    @GetMapping("/customer/{customerId}/upcoming")
    public ResponseEntity<List<Appointment>> getUpcoming(@PathVariable Long customerId) {
        return ResponseEntity.ok(appointmentService.getUpcomingAppointments(customerId));
    }

    // Müşterinin geçmiş randevuları
    @GetMapping("/customer/{customerId}/past")
    public ResponseEntity<List<Appointment>> getPast(@PathVariable Long customerId) {
        return ResponseEntity.ok(appointmentService.getPastAppointments(customerId));
    }

    // İşletmenin randevuları
    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<Appointment>> getBusinessAppointments(
            @PathVariable Long businessId,
            @RequestParam String start,
            @RequestParam String end) {

        return ResponseEntity.ok(appointmentService.getBusinessAppointments(
            businessId,
            LocalDateTime.parse(start),
            LocalDateTime.parse(end)
        ));
    }

    // Randevu iptal
    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<Appointment> cancel(
            @PathVariable Long appointmentId,
            @RequestParam Long customerId) {

        return ResponseEntity.ok(appointmentService.cancelAppointment(appointmentId, customerId));
    }
}
