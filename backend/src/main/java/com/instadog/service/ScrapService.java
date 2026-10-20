package com.instadog.service;

import com.instadog.dto.ScrapRequest;
import com.instadog.dto.ScrapResponse;
import com.instadog.entity.Scrap;
import com.instadog.entity.Usuario;
import com.instadog.repository.ScrapRepository;
import com.instadog.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScrapService {

    private final ScrapRepository scrapRepository;
    private final UsuarioRepository usuarioRepository;

    public Page<ScrapResponse> listar(Long destinatarioId, Pageable pageable) {
        if (!usuarioRepository.existsById(destinatarioId)) {
            throw new IllegalArgumentException("Usuário não encontrado");
        }
        return scrapRepository.findByDestinatarioIdOrderByCriadoEmDesc(destinatarioId, pageable)
                .map(this::toResponse);
    }

    public long contar(Long destinatarioId) {
        return scrapRepository.findByDestinatarioIdOrderByCriadoEmDesc(destinatarioId).size();
    }

    @Transactional
    public ScrapResponse criar(Long autorId, Long destinatarioId, ScrapRequest request) {
        if (autorId.equals(destinatarioId)) {
            throw new IllegalArgumentException("Você não pode deixar um recado para si mesmo");
        }

        Usuario autor = usuarioRepository.findById(autorId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Usuario destinatario = usuarioRepository.findById(destinatarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Scrap scrap = scrapRepository.save(Scrap.builder()
                .autor(autor)
                .destinatario(destinatario)
                .texto(request.getTexto().trim())
                .build());

        return toResponse(scrap);
    }

    @Transactional
    public void excluir(Long scrapId, Long usuarioId) {
        Scrap scrap = scrapRepository.findById(scrapId)
                .orElseThrow(() -> new IllegalArgumentException("Recado não encontrado"));

        if (!scrap.getAutor().getId().equals(usuarioId)) {
            throw new IllegalArgumentException("Você só pode apagar os seus próprios recados");
        }

        scrapRepository.delete(scrap);
    }

    private ScrapResponse toResponse(Scrap scrap) {
        ScrapResponse response = new ScrapResponse();
        response.setId(scrap.getId());
        response.setAutorId(scrap.getAutor().getId());
        response.setAutorNome(scrap.getAutor().getNome());
        response.setAutorFotoUrl(scrap.getAutor().getFotoUrl());
        response.setTexto(scrap.getTexto());
        response.setCriadoEm(scrap.getCriadoEm());
        return response;
    }
}
