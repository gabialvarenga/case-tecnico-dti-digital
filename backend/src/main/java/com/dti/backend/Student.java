package com.dti.backend;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private double grade1;
 
    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private double grade2;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private double grade3;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private double grade4;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private double grade5;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private double attendance;

    public double getAverageGrade() {
        return (grade1 + grade2 + grade3 + grade4 + grade5) / 5.0;
    }
}

