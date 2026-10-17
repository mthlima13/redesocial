package com.instadog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "caos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"usuario", "posts"})
public class Cao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 100)
    private String raca;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 50)
    private String porte;

    @Column(length = 500)
    private String bio;

    @Column(length = 500)
    private String fotoUrl;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @OneToMany(mappedBy = "cao", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.Set<Post> posts = new java.util.HashSet<>();
}
