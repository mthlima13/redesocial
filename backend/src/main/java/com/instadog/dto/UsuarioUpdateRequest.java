package com.instadog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Atualização de perfil do tutor.
 * Não recebe senha: a senha só é definida no cadastro.
 */
public class UsuarioUpdateRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    @Size(max = 200, message = "Cidade deve ter no máximo 200 caracteres")
    private String cidade;

    @Size(max = 500, message = "Bio deve ter no máximo 500 caracteres")
    private String bio;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
