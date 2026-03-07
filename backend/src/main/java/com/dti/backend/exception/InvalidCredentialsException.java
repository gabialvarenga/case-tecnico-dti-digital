package com.dti.backend.exception;

public class InvalidCredentialsException extends RuntimeException {
    
    public InvalidCredentialsException() {
        super("Usuário ou senha inválidos");
    }
}
