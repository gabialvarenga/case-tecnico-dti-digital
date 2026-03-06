package com.dti.backend.dto;

import jakarta.validation.constraints.*;

public record StudentRequest(
        @NotBlank String name,
        @DecimalMin("0.0") @DecimalMax("10.0") double grade1,
        @DecimalMin("0.0") @DecimalMax("10.0") double grade2,
        @DecimalMin("0.0") @DecimalMax("10.0") double grade3,
        @DecimalMin("0.0") @DecimalMax("10.0") double grade4,
        @DecimalMin("0.0") @DecimalMax("10.0") double grade5,
        @DecimalMin("0.0") @DecimalMax("100.0") double attendance
) {
}
