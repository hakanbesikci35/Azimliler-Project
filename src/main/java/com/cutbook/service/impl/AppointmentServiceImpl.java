package com.cutbook.service.impl;

import com.cutbook.exception.BusinessRuleException;
import com.cutbook.exception.ResourceNotFoundException;
import com.cutbook.exception.UnauthorizedException;
import com.cutbook.model.Appointment;
import com.cutbook.model.Business;
import com.cutbook.model.Service;
import com.cutbook.model.User;
import com.cutbook.repository.AppointmentRepository;
import com.cutbook.repository.BusinessRepository;
import com.cutbook.repository.ServiceRepository;
import com.cutbook.repository.UserRepository;
import com.cutbook.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final ServiceRepository serviceRepository;

    @Override
    public Appointment createAppointment(Long customerId, Long businessId, Long serviceId,
                                         LocalDateTime startTime, LocalDateTime endTime, String notes) {
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Geçmiş bir tarihe randevu oluşturamazsınız");
        }
        if (appointmentRepository.existsConflict(businessId, startTime)) {
            throw new BusinessRuleException("Bu saat dolu, lütfen başka bir saat seçin");
        }

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
                
        if (customer.getRole() == User.Role.OWNER) {
            throw new BusinessRuleException("İşletme sahipleri randevu alamaz");}

        

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("İşletme bulunamadı"));

        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Hizmet bulunamadı"));

        // Servisin bu işletmeye ait olduğunu doğrula
        if (!service.getBusiness().getId().equals(businessId)) {
            throw new BusinessRuleException("Bu hizmet seçilen işletmeye ait değil");
        }

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

    @Override
    public List<Appointment> getCustomerAppointments(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Appointment> getUpcomingAppointments(Long customerId) {
        return appointmentRepository.findByCustomerIdAndStartTimeAfter(customerId, LocalDateTime.now());
    }

    @Override
    public List<Appointment> getPastAppointments(Long customerId) {
        return appointmentRepository.findByCustomerIdAndStartTimeBefore(customerId, LocalDateTime.now());
    }

    @Override
    public List<Appointment> getBusinessAppointments(Long businessId, LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByBusinessIdAndStartTimeBetween(businessId, start, end);
    }

    @Override
    public Appointment cancelAppointment(Long appointmentId, Long customerId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Randevu bulunamadı"));

        if (!appointment.getCustomer().getId().equals(customerId)) {
            throw new UnauthorizedException("Bu randevuyu iptal etme yetkiniz yok");
        }

        if (appointment.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Geçmiş randevular iptal edilemez");
        }

        appointment.setStatus(Appointment.Status.CANCELLED);
        return appointmentRepository.save(appointment);
    }
}