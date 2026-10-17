package com.instadog.service;

import com.instadog.dto.PostRequest;
import com.instadog.dto.PostResponse;
import com.instadog.entity.Cao;
import com.instadog.entity.Post;
import com.instadog.entity.Usuario;
import com.instadog.repository.CaoRepository;
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
public class PostService {

    private final PostRepository postRepository;
    private final UsuarioRepository usuarioRepository;
    private final CaoRepository caoRepository;
    private final CurtidaRepository curtidaRepository;

    @Transactional
    public PostResponse criar(Long usuarioId, PostRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Cao cao = caoRepository.findById(request.getCaoId())
                .orElseThrow(() -> new IllegalArgumentException("Cão não encontrado"));

        if (!cao.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalArgumentException("O cão não pertence a este usuário");
        }

        Post post = Post.builder()
                .usuario(usuario)
                .cao(cao)
                .descricao(request.getDescricao())
                .build();

        post = postRepository.save(post);
        return toResponse(post, usuarioId);
    }

    public PostResponse buscarPorId(Long id, Long usuarioLogadoId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post não encontrado"));
        return toResponse(post, usuarioLogadoId);
    }

    public Page<PostResponse> listarFeed(Pageable pageable, Long usuarioLogadoId) {
        Page<Post> posts = postRepository.findAllByOrderByCriadoEmDesc(pageable);
        return posts.map(post -> toResponse(post, usuarioLogadoId));
    }

    public Page<PostResponse> listarPorUsuario(Long usuarioId, Pageable pageable, Long usuarioLogadoId) {
        Page<Post> posts = postRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId, pageable);
        return posts.map(post -> toResponse(post, usuarioLogadoId));
    }

    @Transactional
    public void excluir(Long id, Long usuarioId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post não encontrado"));

        if (!post.getUsuario().getId().equals(usuarioId)) {
            throw new IllegalArgumentException("Você não tem permissão para excluir este post");
        }

        postRepository.delete(post);
    }

    private PostResponse toResponse(Post post, Long usuarioLogadoId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setUsuarioId(post.getUsuario().getId());
        response.setUsuarioNome(post.getUsuario().getNome());
        response.setUsuarioFotoUrl(post.getUsuario().getFotoUrl());
        response.setCaoId(post.getCao().getId());
        response.setCaoNome(post.getCao().getNome());
        response.setCaoFotoUrl(post.getCao().getFotoUrl());
        response.setDescricao(post.getDescricao());
        response.setImagemUrl(post.getImagemUrl());
        response.setCriadoEm(post.getCriadoEm());
        response.setCurtidasCount(post.getCurtidas().size());
        response.setComentariosCount(post.getComentarios().size());

        if (usuarioLogadoId != null) {
            response.setCurtidoPorUsuarioLogado(
                    post.getCurtidas().stream()
                            .anyMatch(c -> c.getUsuario().getId().equals(usuarioLogadoId))
            );
        }
        return response;
    }
}
