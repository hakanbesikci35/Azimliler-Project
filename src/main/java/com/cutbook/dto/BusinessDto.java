package com.cutbook.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BusinessDto {
    private Long id;
    private Long ownerId;

    @NotBlank
    private String name;
    private String description;
    private String phone;
    private String address;
}