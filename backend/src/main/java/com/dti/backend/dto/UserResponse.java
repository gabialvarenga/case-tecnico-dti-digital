package com.dti.backend.dto;

public record UserResponse(
        Long id,
        String username,
        String role
) {
}
