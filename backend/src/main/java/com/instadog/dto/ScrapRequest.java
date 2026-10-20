package com.instadog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ScrapRequest {

    @NotBlank(message = "Escreva o recado")
    @Size(max = 500, message = "O recado deve ter no máximo 500 caracteres")
    private String texto;

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
}
