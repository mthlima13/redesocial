package com.instadog.controller;

import com.instadog.dto.UsuarioResponse;
import com.instadog.dto.UsuarioUpdateRequest;
import com.instadog.security.UserDetailsImpl;
import com.instadog.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> getPerfil(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        UsuarioResponse response = usuarioService.buscarPorId(userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> getPerfilPublico(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioResponse> atualizarPerfil(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UsuarioUpdateRequest request) {
        UsuarioResponse response = usuarioService.atualizar(userDetails.getId(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/perfil")
    public ResponseEntity<Void> excluirConta(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        usuarioService.excluir(userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
