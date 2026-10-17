package com.instadog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CaoRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;

    @Size(max = 100, message = "Raça deve ter no máximo 100 caracteres")
    private String raca;

    private LocalDate dataNascimento;

    @Size(max = 50, message = "Porte deve ter no máximo 50 caracteres")
    private String porte;

    @Size(max = 500, message = "Bio deve ter no máximo 500 caracteres")
    private String bio;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getRaca() { return raca; }
    public void setRaca(String raca) { this.raca = raca; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getPorte() { return porte; }
    public void setPorte(String porte) { this.porte = porte; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
