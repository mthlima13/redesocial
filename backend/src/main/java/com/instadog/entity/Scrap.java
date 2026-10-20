package com.instadog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Recado (scrap) — o muro de mensagens do perfil, inspirado no Orkut.
 */
@Entity
@Table(name = "scraps", indexes = {
    @Index(name = "idx_scraps_destinatario_id", columnList = "destinatario_id"),
    @Index(name = "idx_scraps_autor_id", columnList = "autor_id"),
    @Index(name = "idx_scraps_criado_em", columnList = "criado_em")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"autor", "destinatario"})
public class Scrap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario;

    @Column(nullable = false, length = 500)
    private String texto;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;
}
