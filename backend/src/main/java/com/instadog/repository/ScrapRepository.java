package com.instadog.repository;

import com.instadog.entity.Scrap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScrapRepository extends JpaRepository<Scrap, Long> {

    Page<Scrap> findByDestinatarioIdOrderByCriadoEmDesc(Long destinatarioId, Pageable pageable);

    List<Scrap> findByDestinatarioIdOrderByCriadoEmDesc(Long destinatarioId);

    void deleteByIdAndAutorId(Long id, Long autorId);
}
