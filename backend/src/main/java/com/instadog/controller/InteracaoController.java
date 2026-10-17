package com.instadog.controller;

import com.instadog.dto.ComentarioRequest;
import com.instadog.dto.ComentarioResponse;
import com.instadog.security.UserDetailsImpl;
import com.instadog.service.InteracaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interacoes")
@RequiredArgsConstructor
public class InteracaoController {

    private final InteracaoService interacaoService;

    @PostMapping("/curtir/{postId}")
    public ResponseEntity<Void> curtir(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long postId) {
        interacaoService.curtir(userDetails.getId(), postId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/comentar/{postId}")
    public ResponseEntity<ComentarioResponse> comentar(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long postId,
            @Valid @RequestBody ComentarioRequest request) {
        ComentarioResponse response = interacaoService.comentar(userDetails.getId(), postId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/comentarios/{postId}")
    public ResponseEntity<PageableResponse<ComentarioResponse>> listarComentarios(
            @PathVariable Long postId,
            @PageableDefault(size = 10, sort = "criadoEm") Pageable pageable,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        var page = interacaoService.listarComentarios(postId, pageable, userDetails.getId());
        return ResponseEntity.ok(new PageableResponse<>(page));
    }

    @DeleteMapping("/comentarios/{comentarioId}")
    public ResponseEntity<Void> excluirComentario(
            @PathVariable Long comentarioId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        interacaoService.excluirComentario(comentarioId, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
