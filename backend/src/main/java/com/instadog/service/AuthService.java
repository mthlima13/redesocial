package com.instadog.service;

import com.instadog.dto.AuthResponse;
import com.instadog.dto.LoginRequest;
import com.instadog.dto.UsuarioRequest;
import com.instadog.dto.UsuarioResponse;
import com.instadog.entity.Usuario;
import com.instadog.repository.UsuarioRepository;
import com.instadog.security.JwtUtil;
import com.instadog.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public UsuarioResponse cadastrar(UsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
                        .getDefault().encode(request.getSenha()))
                .cidade(request.getCidade())
                .bio(request.getBio())
                .ativo(true)
                .build();

        usuario = usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.gerarToken(userDetails);

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        return new AuthResponse(token, toResponse(usuario));
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
