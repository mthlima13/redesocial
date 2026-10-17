package com.instadog.service;

import com.instadog.dto.ComentarioRequest;
import com.instadog.dto.ComentarioResponse;
import com.instadog.entity.Comentario;
import com.instadog.entity.Post;
import com.instadog.entity.Usuario;
import com.instadog.repository.ComentarioRepository;
import com.instadog.repository.CurtidaRepository;
import com.instadog.repository.PostRepository;
import com.instadog.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InteracaoService {

    private final CurtidaRepository curtidaRepository;
    private final ComentarioRepository comentarioRepository;
    private final PostRepository postRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public void curtir(Long usuarioId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post não encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (curtidaRepository.existsByUsuarioIdAndPostId(usuarioId, postId)) {
            curtidaRepository.deleteByUsuarioIdAndPostId(usuarioId, postId);
        } else {
            com.instadog.entity.Curtida curtida = com.instadog.entity.Curtida.builder()
                    .usuario(usuario)
                    .post(post)
                    .build();
            curtidaRepository.save(curtida);
        }
    }

    public boolean isCurtidoPor(Long usuarioId, Long postId) {
        return curtidaRepository.existsByUsuarioIdAndPostId(usuarioId, postId);
    }

    public long contarCurtidas(Long postId) {
        return curtidaRepository.countByPostId(postId);
    }

    @Transactional
    public ComentarioResponse comentar(Long usuarioId, Long postId, ComentarioRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post não encontrado"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Comentario comentario = Comentario.builder()
                .usuario(usuario)
                .post(post)
                .texto(request.getTexto())
                .build();

        comentario = comentarioRepository.save(comentario);
        return toResponse(comentario);
    }

    public Page<ComentarioResponse> listarComentarios(Long postId, Pageable pageable, Long usuarioLogadoId) {
        Page<Comentario> comentarios = comentarioRepository.findByPostIdOrderByCriadoEmDesc(postId, pageable);
        return comentarios.map(this::toResponse);
    }

    @Transactional
    public void excluirComentario(Long comentarioId, Long usuarioId) {
        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new IllegalArgumentException("Comentário não encontrado"));

        if (!comentario.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalArgumentException("Você não tem permissão para excluir este comentário");
        }

        comentarioRepository.delete(comentario);
    }

    private ComentarioResponse toResponse(Comentario comentario) {
        ComentarioResponse response = new ComentarioResponse();
        response.setId(comentario.getId());
        response.setUsuarioId(comentario.getUsuario().getId());
        response.setUsuarioNome(comentario.getUsuario().getNome());
        response.setUsuarioFotoUrl(comentario.getUsuario().getFotoUrl());
        response.setTexto(comentario.getTexto());
        response.setCriadoEm(comentario.getCriadoEm());
        return response;
    }
}
