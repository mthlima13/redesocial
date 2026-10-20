package com.instadog.service;

import com.instadog.dto.UsuarioRequest;
import com.instadog.dto.UsuarioResponse;
import com.instadog.dto.UsuarioUpdateRequest;
import com.instadog.entity.Usuario;
import com.instadog.repository.ComentarioRepository;
import com.instadog.repository.CurtidaRepository;
import com.instadog.repository.SeguirRepository;
import com.instadog.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SeguirRepository seguirRepository;
    private final CurtidaRepository curtidaRepository;
    private final ComentarioRepository comentarioRepository;

    @Transactional
    public UsuarioResponse cadastrar(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .cidade(request.getCidade())
                .bio(request.getBio())
                .ativo(true)
                .build();

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        return toResponse(usuario);
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioUpdateRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (!usuario.getEmail().equalsIgnoreCase(request.getEmail())
                && usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setCidade(request.getCidade());
        usuario.setBio(request.getBio());

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    @Transactional
    public void excluir(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Dependências que não são cobertas pelo cascade do JPA
        seguirRepository.deleteAll(seguirRepository.findBySeguidorId(id));
        seguirRepository.deleteAll(seguirRepository.findBySeguidoId(id));
        curtidaRepository.deleteByUsuarioId(id);
        comentarioRepository.deleteByUsuarioId(id);

        // Posts e cães são removidos em cascade pela entidade Usuario
        usuarioRepository.delete(usuario);
    }

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setId(usuario.getId());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setCidade(usuario.getCidade());
        response.setBio(usuario.getBio());
        response.setFotoUrl(usuario.getFotoUrl());
        response.setCriadoEm(usuario.getCriadoEm());
        return response;
    }
}
