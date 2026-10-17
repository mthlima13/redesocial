package com.instadog.controller;

import com.instadog.security.UserDetailsImpl;
import com.instadog.service.SeguirService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seguir")
@RequiredArgsConstructor
public class SeguirController {

    private final SeguirService seguirService;

    @PostMapping("/{usuarioId}")
    public ResponseEntity<Void> seguir(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long usuarioId) {
        seguirService.seguir(userDetails.getId(), usuarioId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> deixarDeSeguir(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long usuarioId) {
        seguirService.deixarDeSeguir(userDetails.getId(), usuarioId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/is-seguindo/{usuarioId}")
    public ResponseEntity<Boolean> isSeguindo(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long usuarioId) {
        boolean seguindo = seguirService.isSeguindo(userDetails.getId(), usuarioId);
        return ResponseEntity.ok(seguindo);
    }

    @GetMapping("/contar-seguidores/{usuarioId}")
    public ResponseEntity<Long> contarSeguidores(@PathVariable Long usuarioId) {
        long count = seguirService.contarSeguidores(usuarioId);
        return ResponseEntity.ok(count);
    }
}
