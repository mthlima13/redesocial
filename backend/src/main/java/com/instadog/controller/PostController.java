package com.instadog.controller;

import com.instadog.dto.PostRequest;
import com.instadog.dto.PostResponse;
import com.instadog.security.UserDetailsImpl;
import com.instadog.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> criar(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody PostRequest request) {
        PostResponse response = postService.criar(userDetails.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PageableResponse<PostResponse>> listarFeed(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PageableDefault(size = 10, sort = "criadoEm") Pageable pageable) {
        var page = postService.listarFeed(pageable, userDetails.getId());
        return ResponseEntity.ok(new PageableResponse<>(page));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<PageableResponse<PostResponse>> listarPorUsuario(
            @PathVariable Long usuarioId,
            @PageableDefault(size = 10, sort = "criadoEm") Pageable pageable,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        var page = postService.listarPorUsuario(usuarioId, pageable, userDetails.getId());
        return ResponseEntity.ok(new PageableResponse<>(page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        PostResponse response = postService.buscarPorId(id, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        postService.excluir(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
