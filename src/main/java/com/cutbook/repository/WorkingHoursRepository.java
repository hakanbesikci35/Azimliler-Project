package com.cutbook.repository;

import com.cutbook.model.WorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WorkingHoursRepository extends JpaRepository<WorkingHours, Long> {
    List<WorkingHours> findByBusinessId(Long businessId);
    Optional<WorkingHours> findByBusinessIdAndDayOfWeek(Long businessId, String dayOfWeek);
}