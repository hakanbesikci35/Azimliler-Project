package com.cutbook.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({"appointments", "password"})
    private User customer;

    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false)
    @JsonIgnoreProperties({"services", "workingHours", "appointments"})
    private Business business;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    @JsonIgnoreProperties({"business"})
    private Service service;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum Status {
        PENDING, CANCELLED
    }
}
