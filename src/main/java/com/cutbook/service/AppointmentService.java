package com.cutbook.service;

import com.cutbook.model.Appointment;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    Appointment createAppointment(Long customerId, Long businessId, Long serviceId, LocalDateTime startTime, LocalDateTime endTime, String notes);
    List<Appointment> getCustomerAppointments(Long customerId);
    List<Appointment> getUpcomingAppointments(Long customerId);
    List<Appointment> getPastAppointments(Long customerId);
    List<Appointment> getBusinessAppointments(Long businessId, LocalDateTime start, LocalDateTime end);
    Appointment cancelAppointment(Long appointmentId, Long customerId);
}