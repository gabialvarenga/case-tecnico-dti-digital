package com.dti.backend;

import com.dti.backend.dto.UserRequest;
import com.dti.backend.dto.UserResponse;
import com.dti.backend.entity.User;
import com.dti.backend.exception.InvalidCredentialsException;
import com.dti.backend.exception.UserAlreadyExistsException;
import com.dti.backend.repository.UserRepository;
import com.dti.backend.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldRegisterNewUser() {
        UserRequest request = new UserRequest("joao", "senha123");

        User savedUser = User.builder()
                .id(1L)
                .username("joao")
                .password("senha123")
                .role("USER")
                .build();

        when(userRepository.existsByUsername("joao")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponse response = userService.register(request);

        assertEquals("joao", response.username());
        assertEquals(1L, response.id());
        assertEquals("USER", response.role());
        
        verify(userRepository).existsByUsername("joao");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenRegisteringDuplicateUser() {
        UserRequest request = new UserRequest("joao", "senha123");

        when(userRepository.existsByUsername("joao")).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.register(request);
        });

        verify(userRepository).existsByUsername("joao");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldLoginWithValidCredentials() {
        UserRequest request = new UserRequest("joao", "senha123");

        User user = User.builder()
                .id(1L)
                .username("joao")
                .password("senha123")
                .role("USER")
                .build();

        when(userRepository.findByUsername("joao")).thenReturn(Optional.of(user));

        UserResponse response = userService.login(request);

        assertEquals("joao", response.username());
        assertEquals(1L, response.id());
        
        verify(userRepository).findByUsername("joao");
    }

    @Test
    void shouldThrowExceptionWhenLoginWithInvalidUsername() {
        UserRequest request = new UserRequest("invalid", "senha123");

        when(userRepository.findByUsername("invalid")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> {
            userService.login(request);
        });

        verify(userRepository).findByUsername("invalid");
    }

    @Test
    void shouldThrowExceptionWhenLoginWithInvalidPassword() {
        UserRequest request = new UserRequest("joao", "senhaerrada");

        User user = User.builder()
                .id(1L)
                .username("joao")
                .password("senha123")
                .role("USER")
                .build();

        when(userRepository.findByUsername("joao")).thenReturn(Optional.of(user));

        assertThrows(InvalidCredentialsException.class, () -> {
            userService.login(request);
        });

        verify(userRepository).findByUsername("joao");
    }
}
