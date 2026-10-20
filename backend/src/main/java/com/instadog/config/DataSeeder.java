package com.instadog.config;

import com.instadog.entity.Cao;
import com.instadog.entity.Comentario;
import com.instadog.entity.Curtida;
import com.instadog.entity.Post;
import com.instadog.entity.Scrap;
import com.instadog.entity.Seguir;
import com.instadog.entity.Usuario;
import com.instadog.repository.CaoRepository;
import com.instadog.repository.ComentarioRepository;
import com.instadog.repository.CurtidaRepository;
import com.instadog.repository.PostRepository;
import com.instadog.repository.ScrapRepository;
import com.instadog.repository.SeguirRepository;
import com.instadog.repository.UsuarioRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;
    private final TransactionTemplate transactionTemplate;

    @Value("${instadog.seed.enabled:true}")
    private boolean seedEnabled;

    @Value("${instadog.seed.reset:false}")
    private boolean seedReset;

    @Bean
    CommandLineRunner seed(UsuarioRepository usuarioRepository,
                           CaoRepository caoRepository,
                           PostRepository postRepository,
                           CurtidaRepository curtidaRepository,
                           ComentarioRepository comentarioRepository,
                           SeguirRepository seguirRepository,
                           ScrapRepository scrapRepository,
                           EntityManager entityManager) {
        return args -> {
            if (!seedEnabled) {
                log.info("Seed desativado (instadog.seed.enabled=false)");
                return;
            }

            if (seedReset) {
                transactionTemplate.executeWithoutResult(status ->
                        limpar(usuarioRepository, caoRepository, postRepository,
                                curtidaRepository, comentarioRepository, seguirRepository, scrapRepository));
            }

            if (usuarioRepository.count() > 0) {
                log.info("Banco já possui dados, pulando seed");
                return;
            }

            transactionTemplate.executeWithoutResult(status ->
                    popular(usuarioRepository, caoRepository, postRepository,
                            curtidaRepository, comentarioRepository, seguirRepository,
                            scrapRepository, entityManager));
        };
    }

    private void popular(UsuarioRepository usuarioRepository,
                         CaoRepository caoRepository,
                         PostRepository postRepository,
                         CurtidaRepository curtidaRepository,
                         ComentarioRepository comentarioRepository,
                         SeguirRepository seguirRepository,
                         ScrapRepository scrapRepository,
                         EntityManager entityManager) {

        Map<String, Usuario> tutores = new HashMap<>();
        for (DemoData.Tutor tutor : DemoData.TUTORES) {
            Usuario usuario = usuarioRepository.save(Usuario.builder()
                    .nome(tutor.nome())
                    .email(tutor.email())
                    .senha(passwordEncoder.encode(tutor.senha()))
                    .cidade(tutor.cidade())
                    .bio(tutor.bio())
                    .fotoUrl("https://i.pravatar.cc/150?img=" + tutor.avatar())
                    .ativo(true)
                    .build());
            tutores.put(tutor.email(), usuario);
        }

        Map<String, Cao> caes = new HashMap<>();
        for (DemoData.Cao cao : DemoData.CAOS) {
            Cao entidade = caoRepository.save(Cao.builder()
                    .usuario(tutores.get(cao.tutor()))
                    .nome(cao.nome())
                    .raca(cao.raca())
                    .dataNascimento(cao.nascimento())
                    .porte(cao.porte())
                    .bio(cao.bio())
                    .fotoUrl(cao.foto())
                    .build());
            caes.put(cao.nome(), entidade);
        }

        List<Post> posts = new ArrayList<>();
        for (DemoData.Post post : DemoData.POSTS) {
            Cao cao = caes.get(post.cao());
            posts.add(postRepository.save(Post.builder()
                    .usuario(cao.getUsuario())
                    .cao(cao)
                    .descricao(post.descricao())
                    .imagemUrl(post.imagem())
                    .build()));
        }

        // Curtidas: cada publicação recebe curtidas de um grupo rotativo de tutores.
        // A ordem vem de DemoData.TUTORES para que o resultado seja sempre o mesmo.
        List<Usuario> listaTutores = DemoData.TUTORES.stream()
                .map(tutor -> tutores.get(tutor.email()))
                .toList();
        for (int i = 0; i < posts.size(); i++) {
            int quantidade = 2 + (i % 4);
            for (int j = 0; j < quantidade; j++) {
                Usuario autor = listaTutores.get((i * 3 + j * 2) % listaTutores.size());
                if (autor.equals(posts.get(i).getUsuario())) {
                    continue;
                }
                curtidaRepository.save(Curtida.builder()
                        .usuario(autor)
                        .post(posts.get(i))
                        .build());
            }
        }

        for (DemoData.Comentario comentario : DemoData.COMENTARIOS) {
            if (comentario.post() < 0 || comentario.post() >= posts.size()) {
                continue;
            }
            comentarioRepository.save(Comentario.builder()
                    .usuario(tutores.get(comentario.autor()))
                    .post(posts.get(comentario.post()))
                    .texto(comentario.texto())
                    .build());
        }

        for (DemoData.Seguimento seguimento : DemoData.SEGUIMENTOS) {
            seguirRepository.save(Seguir.builder()
                    .seguidor(tutores.get(seguimento.seguidor()))
                    .seguido(tutores.get(seguimento.seguido()))
                    .build());
        }

        for (DemoData.Scrap scrap : DemoData.SCRAPS) {
            scrapRepository.save(Scrap.builder()
                    .autor(tutores.get(scrap.autor()))
                    .destinatario(tutores.get(scrap.destinatario()))
                    .texto(scrap.texto())
                    .build());
        }

        espalharDatas(entityManager);

        log.info("Seed de demonstração concluído: {} tutores, {} cães, {} publicações, {} curtidas, {} comentários, {} vínculos de seguir",
                tutores.size(), caes.size(), posts.size(),
                curtidaRepository.count(), comentarioRepository.count(), seguirRepository.count());
        log.info("Acesso de demonstração: demo@instadog.com / demo123");
    }

    /**
     * Reposiciona as datas de criação para que o feed pareça um histórico real
     * (publicações distribuídas nas últimas semanas, em vez de tudo no mesmo instante).
     */
    private void espalharDatas(EntityManager entityManager) {
        // Garante que tudo já foi gravado antes dos UPDATE de data
        entityManager.flush();

        // A publicação mais recente (id menor) fica com a data de agora; as demais,
        // são espaçadas de 8 em 8 horas para trás.
        entityManager.createNativeQuery(
                        "UPDATE posts SET criado_em = NOW() - (INTERVAL '8 hours' * (id - 1))")
                .executeUpdate();

        // Curtidas e comentários sempre depois da publicação a que pertencem
        entityManager.createNativeQuery(
                        "UPDATE comentarios SET criado_em = (SELECT p.criado_em + INTERVAL '45 minutes' FROM posts p WHERE p.id = comentarios.post_id)")
                .executeUpdate();

        entityManager.createNativeQuery(
                        "UPDATE curtidas SET criado_em = (SELECT p.criado_em + INTERVAL '20 minutes' FROM posts p WHERE p.id = curtidas.post_id)")
                .executeUpdate();

        // Recados espalhados nas últimas semanas, como um mural de verdade
        entityManager.createNativeQuery(
                        "UPDATE scraps SET criado_em = NOW() - (INTERVAL '9 hours' * id)")
                .executeUpdate();

        // Cadastro dos tutores e dos cães espalhado ao longo do último ano
        entityManager.createNativeQuery(
                        "UPDATE usuarios SET criado_em = NOW() - (INTERVAL '1 day' * (RANDOM() * 300))")
                .executeUpdate();
        entityManager.createNativeQuery(
                        "UPDATE caos SET criado_em = NOW() - (INTERVAL '1 day' * (RANDOM() * 250))")
                .executeUpdate();
    }

    private void limpar(UsuarioRepository usuarioRepository,
                        CaoRepository caoRepository,
                        PostRepository postRepository,
                        CurtidaRepository curtidaRepository,
                        ComentarioRepository comentarioRepository,
                        SeguirRepository seguirRepository,
                        ScrapRepository scrapRepository) {
        scrapRepository.deleteAll();
        seguirRepository.deleteAll();
        curtidaRepository.deleteAll();
        comentarioRepository.deleteAll();
        postRepository.deleteAll();
        caoRepository.deleteAll();
        usuarioRepository.deleteAll();
        log.info("Dados anteriores removidos (instadog.seed.reset=true)");
    }
}
