package com.dti.backend.service;

import com.dti.backend.dto.UserRequest;
import com.dti.backend.dto.UserResponse;
import com.dti.backend.entity.User;
import com.dti.backend.exception.InvalidCredentialsException;
import com.dti.backend.exception.UserAlreadyExistsException;
import com.dti.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse register(UserRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw new UserAlreadyExistsException(request.username());
        }

        User user = User.builder()
                .username(request.username())
                .password(request.password())
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getRole()
        );
    }

    public UserResponse login(UserRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(InvalidCredentialsException::new);

        // Valida senha (em produção, usar BCrypt)
        if (!user.getPassword().equals(request.password())) {
            throw new InvalidCredentialsException();
        }

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }
}
