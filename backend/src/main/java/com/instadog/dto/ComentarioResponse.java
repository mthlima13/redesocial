package com.instadog.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComentarioResponse {

    private Long id;
    private Long usuarioId;
    private String usuarioNome;
    private String usuarioFotoUrl;
    private String texto;
    private LocalDateTime criadoEm;
}
