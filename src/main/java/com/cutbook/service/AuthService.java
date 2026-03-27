package com.cutbook.service;

import com.cutbook.dto.AuthResponse;
import com.cutbook.dto.LoginRequest;
import com.cutbook.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}