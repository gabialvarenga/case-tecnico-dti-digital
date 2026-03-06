package com.dti.backend.dto;

public record StudentResponse(
        Long id,
        String name,
        double grade1,
        double grade2,
        double grade3,
        double grade4,
        double grade5,
        double attendance,
        double averageGrade
) {
}
