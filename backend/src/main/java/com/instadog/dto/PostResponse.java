package com.instadog.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostResponse {

    private Long id;
    private Long usuarioId;
    private String usuarioNome;
    private String usuarioFotoUrl;
    private Long caoId;
    private String caoNome;
    private String caoFotoUrl;
    private String descricao;
    private String imagemUrl;
    private LocalDateTime criadoEm;
    private Integer curtidasCount;
    private Integer comentariosCount;
    private Boolean curtidoPorUsuarioLogado;
}
