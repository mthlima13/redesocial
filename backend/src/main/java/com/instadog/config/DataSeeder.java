package com.instadog.config;

import com.instadog.entity.Usuario;
import com.instadog.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seed(UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.count() == 0) {
                Usuario demo = Usuario.builder()
                        .nome("Demo Tutor")
                        .email("demo@instadog.com")
                        .senha(passwordEncoder.encode("demo123"))
                        .cidade("São Paulo")
                        .bio("Tutor de demonstração do InstaDog 🐾")
                        .ativo(true)
                        .build();
                usuarioRepository.save(demo);
                log.info("Usuário demo criado: demo@instadog.com / demo123");
            }
        };
    }
}
