package com.instadog.service;

import com.instadog.entity.Seguir;
import com.instadog.entity.Usuario;
import com.instadog.repository.SeguirRepository;
import com.instadog.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeguirService {

    private final SeguirRepository seguirRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public void seguir(Long seguidorId, Long seguidoId) {
        if (seguidorId.equals(seguidoId)) {
            throw new IllegalArgumentException("Você não pode seguir a si mesmo");
        }

        Usuario seguido = usuarioRepository.findById(seguidoId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (seguirRepository.existsBySeguidorIdAndSeguidoId(seguidorId, seguidoId)) {
            throw new IllegalArgumentException("Você já segue este usuário");
        }

        Seguir relacionamento = Seguir.builder()
                .seguidor(usuarioRepository.getReferenceById(seguidorId))
                .seguido(seguido)
                .build();

        seguirRepository.save(relacionamento);
    }

    @Transactional
    public void deixarDeSeguir(Long seguidorId, Long seguidoId) {
        if (!seguirRepository.existsBySeguidorIdAndSeguidoId(seguidorId, seguidoId)) {
            throw new IllegalArgumentException("Você não segue este usuário");
        }
        seguirRepository.deleteBySeguidorIdAndSeguidoId(seguidorId, seguidoId);
    }

    public boolean isSeguindo(Long seguidorId, Long seguidoId) {
        return seguirRepository.existsBySeguidorIdAndSeguidoId(seguidorId, seguidoId);
    }

    public long contarSeguidores(Long usuarioId) {
        return seguirRepository.countBySeguidoId(usuarioId);
    }

    public List<Long> listarIdsSeguidos(Long usuarioId) {
        return seguirRepository.findBySeguidorId(usuarioId).stream()
                .map(s -> s.getSeguido().getId())
                .toList();
    }
}
