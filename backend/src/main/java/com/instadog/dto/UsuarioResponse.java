package com.instadog.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioResponse {

    private Long id;
    private String nome;
    private String email;
    private String cidade;
    private String bio;
    private String fotoUrl;
    private LocalDateTime criadoEm;
}
