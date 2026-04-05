package com.cutbook.service;

import com.cutbook.dto.AuthResponse;
import com.cutbook.dto.LoginRequest;
import com.cutbook.dto.RegisterRequest;
import com.cutbook.exception.ConflictException;
import com.cutbook.exception.ResourceNotFoundException;
import com.cutbook.exception.UnauthorizedException;
import com.cutbook.model.User;
import com.cutbook.repository.UserRepository;
import com.cutbook.security.JwtService;
import com.cutbook.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("hashed_password");
        mockUser.setRole(User.Role.CUSTOMER);
    }

    // --- REGISTER ---

    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");
        req.setRole("CUSTOMER");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(jwtService.generateToken("test@example.com")).thenReturn("mock.jwt.token");

        AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("CUSTOMER", response.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_ThrowsConflictException_WhenEmailAlreadyExists() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");
        req.setRole("CUSTOMER");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_OwnerRole_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("owner@salon.com");
        req.setPassword("pass123");
        req.setRole("OWNER");

        User ownerUser = new User();
        ownerUser.setId(2L);
        ownerUser.setEmail("owner@salon.com");
        ownerUser.setRole(User.Role.OWNER);

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(ownerUser);
        when(jwtService.generateToken(anyString())).thenReturn("owner.token");

        AuthResponse response = authService.register(req);

        assertEquals("OWNER", response.getRole());
    }

    // --- LOGIN ---

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(jwtService.generateToken("test@example.com")).thenReturn("mock.jwt.token");

        AuthResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("CUSTOMER", response.getRole());
        assertEquals(1L, response.getId());
    }

    @Test
    void login_ThrowsResourceNotFoundException_WhenUserNotFound() {
        LoginRequest req = new LoginRequest();
        req.setEmail("notfound@example.com");
        req.setPassword("password");

        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> authService.login(req));
    }

    @Test
    void login_ThrowsUnauthorizedException_WhenWrongPassword() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@example.com");
        req.setPassword("wrong_password");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrong_password", "hashed_password")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(req));
    }

    @Test
    void login_PasswordIsNeverStoredInPlainText() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("new@user.com");
        req.setPassword("plaintext");
        req.setRole("CUSTOMER");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("plaintext")).thenReturn("$2a$hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            assertNotEquals("plaintext", u.getPassword()); // plain text olmamalı
            return mockUser;
        });
        when(jwtService.generateToken(anyString())).thenReturn("token");

        authService.register(req);

        verify(passwordEncoder).encode("plaintext");
    }
}
