package com.instadog.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PostRequest {

    @NotNull(message = "ID do cão é obrigatório")
    private Long caoId;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String descricao;

    public Long getCaoId() { return caoId; }
    public void setCaoId(Long caoId) { this.caoId = caoId; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
}
