package com.dti.backend.exception;

public class StudentNotFoundException extends RuntimeException {
    
    public StudentNotFoundException(Long id) {
        super("Aluno não encontrado com ID: " + id);
    }
}
