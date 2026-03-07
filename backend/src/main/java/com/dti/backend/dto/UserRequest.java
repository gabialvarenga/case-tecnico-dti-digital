package com.dti.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest(
        @NotBlank(message = "Username é obrigatório")
        @Size(min = 3, max = 50, message = "Username deve ter entre 3 e 50 caracteres")
        String username,
        
        @NotBlank(message = "Password é obrigatório")
        @Size(min = 4, message = "Password deve ter no mínimo 4 caracteres")
        String password
) {
}
