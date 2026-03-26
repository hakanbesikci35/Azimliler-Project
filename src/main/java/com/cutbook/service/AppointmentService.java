package com.cutbook.service;

import com.cutbook.exception.BusinessRuleException;
import com.cutbook.exception.ResourceNotFoundException;
import com.cutbook.exception.UnauthorizedException;
import com.cutbook.model.Appointment;
import com.cutbook.model.Business;
import com.cutbook.model.Service;
import com.cutbook.model.User;
import com.cutbook.repository.AppointmentRepository;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;

    // Randevu oluştur
    public Appointment createAppointment(Long customerId, Long businessId, Long serviceId,
                                          LocalDateTime startTime, LocalDateTime endTime, String notes) {

        // Geçmiş tarih kontrolü
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Geçmiş bir tarihe randevu oluşturamazsınız");
        }

        // Çakışma kontrolü
        if (appointmentRepository.existsConflict(businessId, startTime)) {
            throw new BusinessRuleException("Bu saat dolu, lütfen başka bir saat seçin");
        }

        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));

        Business business = businessRepository.findById(businessId)
            .orElseThrow(() -> new ResourceNotFoundException("İşletme bulunamadı"));

        Service service = new Service();
        service.setId(serviceId);

        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setBusiness(business);
        appointment.setService(service);
        appointment.setStartTime(startTime);
        appointment.setEndTime(endTime);
        appointment.setStatus(Appointment.Status.PENDING);
        appointment.setNotes(notes);
        appointment.setCreatedAt(LocalDateTime.now());

        return appointmentRepository.save(appointment);
    }

    // Müşterinin tüm randevuları
    public List<Appointment> getCustomerAppointments(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }

    // Müşterinin gelecek randevuları
    public List<Appointment> getUpcomingAppointments(Long customerId) {
        return appointmentRepository.findByCustomerIdAndStartTimeAfter(customerId, LocalDateTime.now());
    }

    // Müşterinin geçmiş randevuları
    public List<Appointment> getPastAppointments(Long customerId) {
        return appointmentRepository.findByCustomerIdAndStartTimeBefore(customerId, LocalDateTime.now());
    }

    // İşletmenin randevuları (tarih aralığı)
    public List<Appointment> getBusinessAppointments(Long businessId, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByBusinessIdAndStartTimeBetween(businessId, start, end);
    }

    // Randevu iptal
    public Appointment cancelAppointment(Long appointmentId, Long customerId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Randevu bulunamadı"));

        // Başkasının randevusunu iptal edemez
        if (!appointment.getCustomer().getId().equals(customerId)) {
            throw new UnauthorizedException("Bu randevuyu iptal etme yetkiniz yok");
        }

        // Geçmiş randevu iptal edilemez
        if (appointment.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Geçmiş randevular iptal edilemez");
        }

        appointment.setStatus(Appointment.Status.CANCELLED);
        return appointmentRepository.save(appointment);
    }
}