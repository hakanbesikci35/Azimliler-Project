package com.cutbook.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String role;
    private Long id; // Frontend'in isletme sahibini tanimasi icin eklendi
}