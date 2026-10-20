package com.instadog.repository;

import com.instadog.entity.Comentario;
import com.instadog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    Page<Comentario> findByPostIdOrderByCriadoEmDesc(Long postId, Pageable pageable);

    void deleteByPostId(Long postId);

    void deleteByUsuarioId(Long usuarioId);
}
