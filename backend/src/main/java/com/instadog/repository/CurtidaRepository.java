package com.instadog.repository;

import com.instadog.entity.Curtida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CurtidaRepository extends JpaRepository<Curtida, Long> {

    Optional<Curtida> findByUsuarioIdAndPostId(Long usuarioId, Long postId);

    boolean existsByUsuarioIdAndPostId(Long usuarioId, Long postId);

    long countByPostId(Long postId);

    void deleteByUsuarioIdAndPostId(Long usuarioId, Long postId);
}
