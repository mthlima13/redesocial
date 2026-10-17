package com.instadog.dto;

import lombok.Data;

@Data
public class AuthResponse {

    private String token;
    private String tipo = "Bearer";
    private UsuarioResponse usuario;

    public AuthResponse(String token, UsuarioResponse usuario) {
        this.token = token;
        this.usuario = usuario;
    }
}
