package com.instadog.config;

import com.instadog.entity.Cao;
import com.instadog.entity.Comentario;
import com.instadog.entity.Curtida;
import com.instadog.entity.Post;
import com.instadog.entity.Seguir;
import com.instadog.entity.Usuario;
import com.instadog.repository.CaoRepository;
import com.instadog.repository.ComentarioRepository;
import com.instadog.repository.CurtidaRepository;
import com.instadog.repository.PostRepository;
import com.instadog.repository.SeguirRepository;
import com.instadog.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seed(UsuarioRepository usuarioRepository,
                           CaoRepository caoRepository,
                           PostRepository postRepository,
                           CurtidaRepository curtidaRepository,
                           ComentarioRepository comentarioRepository,
                           SeguirRepository seguirRepository) {
        return args -> {
            if (usuarioRepository.count() == 0) {
                // Usuário demo
                Usuario demo = Usuario.builder()
                        .nome("Demo Tutor")
                        .email("demo@instadog.com")
                        .senha(passwordEncoder.encode("demo123"))
                        .cidade("São Paulo")
                        .bio("Tutor de demonstração do InstaDog 🐾")
                        .ativo(true)
                        .build();
                demo = usuarioRepository.save(demo);

                // Usuários de exemplo
                Usuario ana = Usuario.builder()
                        .nome("Ana Silva")
                        .email("ana@instadog.com")
                        .senha(passwordEncoder.encode("123456"))
                        .cidade("Rio de Janeiro")
                        .bio("Amante de animais 🐶")
                        .ativo(true)
                        .build();
                ana = usuarioRepository.save(ana);

                Usuario carlos = Usuario.builder()
                        .nome("Carlos Mendes")
                        .email("carlos@instadog.com")
                        .senha(passwordEncoder.encode("123456"))
                        .cidade("Belo Horizonte")
                        .bio("Pai do Thor, o golden")
                        .ativo(true)
                        .build();
                carlos = usuarioRepository.save(carlos);

                // Cães
                Cao rex = Cao.builder()
                        .usuario(demo)
                        .nome("Rex")
                        .raca("Vira-lata")
                        .dataNascimento(LocalDate.of(2021, 5, 10))
                        .porte("Médio")
                        .bio("Adora brincar de buscar bola")
                        .fotoUrl("https://images.dog.ceo/breeds/mixed/n02099601_103.jpg")
                        .build();
                rex = caoRepository.save(rex);

                Cao luna = Cao.builder()
                        .usuario(ana)
                        .nome("Luna")
                        .raca("SRD")
                        .dataNascimento(LocalDate.of(2022, 2, 15))
                        .porte("Pequeno")
                        .bio("Energética e amarenta")
                        .fotoUrl("https://images.dog.ceo/breeds/mixed/n02099601_2847.jpg")
                        .build();
                luna = caoRepository.save(luna);

                Cao thor = Cao.builder()
                        .usuario(carlos)
                        .nome("Thor")
                        .raca("Golden Retriever")
                        .dataNascimento(LocalDate.of(2020, 11, 3))
                        .porte("Grande")
                        .bio("Gentil e sociável")
                        .fotoUrl("https://images.dog.ceo/breeds/retriever/golden/n02099601_452.jpg")
                        .build();
                thor = caoRepository.save(thor);

                // Seguir
                seguirRepository.save(Seguir.builder()
                        .seguidor(demo).seguido(ana).build());
                seguirRepository.save(Seguir.builder()
                        .seguidor(demo).seguido(carlos).build());
                seguirRepository.save(Seguir.builder()
                        .seguidor(ana).seguido(demo).build());

                // Posts
                List<Post> posts = new ArrayList<>();

                Post p1 = Post.builder()
                        .usuario(demo)
                        .cao(rex)
                        .descricao("Primeiro dia no parque com o Rex! 🌳")
                        .imagemUrl("https://images.dog.ceo/breeds/mixed/n02099601_103.jpg")
                        .build();
                p1 = postRepository.save(p1);
                posts.add(p1);

                Post p2 = Post.builder()
                        .usuario(ana)
                        .cao(luna)
                        .descricao("Luna descobriu o sabor da maçã 🍎")
                        .imagemUrl("https://images.dog.ceo/breeds/mixed/n02099601_2847.jpg")
                        .build();
                p2 = postRepository.save(p2);
                posts.add(p2);

                Post p3 = Post.builder()
                        .usuario(carlos)
                        .cao(thor)
                        .descricao("Thor dormindo depois de uma longa brincadeira 😴")
                        .imagemUrl("https://images.dog.ceo/breeds/retriever/golden/n02099601_452.jpg")
                        .build();
                p3 = postRepository.save(p3);
                posts.add(p3);

                // Curtidas
                curtidaRepository.save(Curtida.builder().usuario(ana).post(p1).build());
                curtidaRepository.save(Curtida.builder().usuario(carlos).post(p1).build());
                curtidaRepository.save(Curtida.builder().usuario(demo).post(p2).build());
                curtidaRepository.save(Curtida.builder().usuario(carlos).post(p2).build());
                curtidaRepository.save(Curtida.builder().usuario(demo).post(p3).build());
                curtidaRepository.save(Curtida.builder().usuario(ana).post(p3).build());

                // Comentários
                comentarioRepository.save(Comentario.builder()
                        .usuario(ana).post(p1)
                        .texto("Que fofo o Rex! 🐶").build());
                comentarioRepository.save(Comentario.builder()
                        .usuario(carlos).post(p1)
                        .texto("Parabéns pelo primeiro parque!").build());
                comentarioRepository.save(Comentario.builder()
                        .usuario(demo).post(p2)
                        .texto("Luna é uma gracinha!").build());

                log.info("Seed concluído: 3 usuários, 3 cães, 3 posts, curtidas e comentários");
            } else {
                log.info("Banco já possui dados, pulando seed");
            }
        };
    }
}
