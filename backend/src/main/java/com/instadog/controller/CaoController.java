package com.instadog.controller;

import com.instadog.dto.CaoRequest;
import com.instadog.dto.CaoResponse;
import com.instadog.security.UserDetailsImpl;
import com.instadog.service.CaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caos")
@RequiredArgsConstructor
public class CaoController {

    private final CaoService caoService;

    @PostMapping
    public ResponseEntity<CaoResponse> cadastrar(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CaoRequest request) {
        CaoResponse response = caoService.cadastrar(userDetails.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/meus")
    public ResponseEntity<List<CaoResponse>> listarMeusCaos(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<CaoResponse> caos = caoService.listarMeusCaos(userDetails.getId());
        return ResponseEntity.ok(caos);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<CaoResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(caoService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaoResponse> buscarPorId(@PathVariable Long id) {
        CaoResponse response = caoService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CaoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CaoRequest request) {
        CaoResponse response = caoService.atualizar(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        caoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
