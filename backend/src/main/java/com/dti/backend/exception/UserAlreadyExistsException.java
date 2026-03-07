package com.dti.backend.exception;

public class UserAlreadyExistsException extends RuntimeException {
    
    public UserAlreadyExistsException(String username) {
        super("Usuário já existe: " + username);
    }
}
