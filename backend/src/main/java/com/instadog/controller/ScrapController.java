package com.instadog.controller;

import com.instadog.dto.ScrapRequest;
import com.instadog.dto.ScrapResponse;
import com.instadog.security.UserDetailsImpl;
import com.instadog.service.ScrapService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scraps")
@RequiredArgsConstructor
public class ScrapController {

    private final ScrapService scrapService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<PageableResponse<ScrapResponse>> listar(
            @PathVariable Long usuarioId,
            @PageableDefault(size = 20, sort = "criadoEm") Pageable pageable) {
        return ResponseEntity.ok(new PageableResponse<>(scrapService.listar(usuarioId, pageable)));
    }

    @GetMapping("/contar/{usuarioId}")
    public ResponseEntity<Long> contar(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(scrapService.contar(usuarioId));
    }

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<ScrapResponse> criar(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long usuarioId,
            @Valid @RequestBody ScrapRequest request) {
        return ResponseEntity.ok(scrapService.criar(userDetails.getId(), usuarioId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        scrapService.excluir(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
