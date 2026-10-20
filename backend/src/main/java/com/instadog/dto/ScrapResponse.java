package com.instadog.dto;

import java.time.LocalDateTime;

public class ScrapResponse {

    private Long id;
    private Long autorId;
    private String autorNome;
    private String autorFotoUrl;
    private String texto;
    private LocalDateTime criadoEm;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAutorId() { return autorId; }
    public void setAutorId(Long autorId) { this.autorId = autorId; }

    public String getAutorNome() { return autorNome; }
    public void setAutorNome(String autorNome) { this.autorNome = autorNome; }

    public String getAutorFotoUrl() { return autorFotoUrl; }
    public void setAutorFotoUrl(String autorFotoUrl) { this.autorFotoUrl = autorFotoUrl; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
