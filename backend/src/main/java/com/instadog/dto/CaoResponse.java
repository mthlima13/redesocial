package com.instadog.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CaoResponse {

    private Long id;
    private String nome;
    private String raca;
    private LocalDate dataNascimento;
    private String porte;
    private String bio;
    private String fotoUrl;
    private LocalDateTime criadoEm;
    private Long usuarioId;
}
