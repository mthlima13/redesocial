package com.instadog.service;

import com.instadog.dto.CaoRequest;
import com.instadog.dto.CaoResponse;
import com.instadog.entity.Cao;
import com.instadog.entity.Usuario;
import com.instadog.repository.CaoRepository;
import com.instadog.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CaoService {

    private final CaoRepository caoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public CaoResponse cadastrar(Long usuarioId, CaoRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Cao cao = Cao.builder()
                .usuario(usuario)
                .nome(request.getNome())
                .raca(request.getRaca())
                .dataNascimento(request.getDataNascimento())
                .porte(request.getPorte())
                .bio(request.getBio())
                .build();

        cao = caoRepository.save(cao);
        return toResponse(cao);
    }

    public CaoResponse buscarPorId(Long id) {
        Cao cao = caoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cão não encontrado"));
        return toResponse(cao);
    }

    @Transactional
    public CaoResponse atualizar(Long id, CaoRequest request) {
        Cao cao = caoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cão não encontrado"));

        cao.setNome(request.getNome());
        cao.setRaca(request.getRaca());
        cao.setDataNascimento(request.getDataNascimento());
        cao.setPorte(request.getPorte());
        cao.setBio(request.getBio());

        cao = caoRepository.save(cao);
        return toResponse(cao);
    }

    @Transactional
    public void excluir(Long id) {
        if (!caoRepository.existsById(id)) {
            throw new IllegalArgumentException("Cão não encontrado");
        }
        caoRepository.deleteById(id);
    }

    private CaoResponse toResponse(Cao cao) {
        CaoResponse response = new CaoResponse();
        response.setId(cao.getId());
        response.setNome(cao.getNome());
        response.setRaca(cao.getRaca());
        response.setDataNascimento(cao.getDataNascimento());
        response.setPorte(cao.getPorte());
        response.setBio(cao.getBio());
        response.setFotoUrl(cao.getFotoUrl());
        response.setCriadoEm(cao.getCriadoEm());
        response.setUsuarioId(cao.getUsuario().getId());
        return response;
    }
}
