package com.oceanspirit.exception;

public class AdNotFoundException extends RuntimeException {
    public AdNotFoundException(String message) {
        super(message);
    }
}