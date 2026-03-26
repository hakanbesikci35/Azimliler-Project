package com.cutbook.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceDto {
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private Integer durationMinutes;
    private BigDecimal price;
}