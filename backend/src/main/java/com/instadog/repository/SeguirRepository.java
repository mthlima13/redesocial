package com.instadog.repository;

import com.instadog.entity.Seguir;
import com.instadog.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeguirRepository extends JpaRepository<Seguir, Long> {

    Optional<Seguir> findBySeguidorIdAndSeguidoId(Long seguidorId, Long seguidoId);

    boolean existsBySeguidorIdAndSeguidoId(Long seguidorId, Long seguidoId);

    List<Seguir> findBySeguidorId(Long seguidorId);

    List<Seguir> findBySeguidoId(Long seguidoId);

    long countBySeguidoId(Long seguidoId);

    void deleteBySeguidorIdAndSeguidoId(Long seguidorId, Long seguidoId);
}
