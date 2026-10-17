package com.instadog.repository;

import com.instadog.entity.Cao;
import com.instadog.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaoRepository extends JpaRepository<Cao, Long> {

    List<Cao> findByUsuarioId(Long usuarioId);

    boolean existsByUsuarioIdAndNome(Long usuarioId, String nome);
}
