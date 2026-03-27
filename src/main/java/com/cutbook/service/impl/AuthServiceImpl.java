package com.cutbook.service.impl;

import com.cutbook.dto.AuthResponse;
import com.cutbook.dto.LoginRequest;
import com.cutbook.dto.RegisterRequest;
import com.cutbook.exception.ConflictException;
import com.cutbook.exception.ResourceNotFoundException;
import com.cutbook.exception.UnauthorizedException;
import com.cutbook.model.User;
import com.cutbook.repository.UserRepository;
import com.cutbook.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Bu email zaten kayıtlı");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        user.setCreatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        return new AuthResponse("token-placeholder", user.getEmail(), user.getRole().name(), user.getId());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Hatalı şifre");
        }

        return new AuthResponse("token-placeholder", user.getEmail(), user.getRole().name(), user.getId());
    }
}