package com.cutbook.repository;

import com.cutbook.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Müşterinin tüm randevuları
    List<Appointment> findByCustomerId(Long customerId);

    // İşletmenin tüm randevuları
    List<Appointment> findByBusinessId(Long businessId);

    // Belirli tarih aralığındaki randevular (işletme sahibi takvim görünümü için)
    List<Appointment> findByBusinessIdAndStartTimeBetween(
        Long businessId,
        LocalDateTime start,
        LocalDateTime end
    );

    // Çakışma kontrolü — aynı işletmede aynı saatte randevu var mı?
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.business.id = :businessId AND a.startTime = :startTime AND a.status = 'PENDING'")
    boolean existsConflict(
        @Param("businessId") Long businessId,
        @Param("startTime") LocalDateTime startTime
    );

    // Müşterinin gelecek randevuları
    List<Appointment> findByCustomerIdAndStartTimeAfter(
        Long customerId,
        LocalDateTime now
    );

    // Müşterinin geçmiş randevuları
    List<Appointment> findByCustomerIdAndStartTimeBefore(
        Long customerId,
        LocalDateTime now
    );
}