package com.instadog.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    private static final long TAMANHO_MAXIMO_BYTES = 10L * 1024 * 1024;

    private static final Set<String> EXTENSOES_PERMITIDAS = Set.of(
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"
    );

    @Value("${instadog.upload.dir:uploads/posts}")
    private String uploadDir;

    @Value("${instadog.upload.base-url:http://localhost:8080/uploads/}")
    private String baseUrl;

    public String salvarArquivo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Nenhum arquivo foi enviado");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Apenas arquivos de imagem são permitidos");
        }

        if (file.getSize() > TAMANHO_MAXIMO_BYTES) {
            throw new IllegalArgumentException("A imagem deve ter no máximo 10MB");
        }

        try {
            String nomeOriginal = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
            String extensao = "";

            int ponto = nomeOriginal.lastIndexOf('.');
            if (ponto > 0 && ponto < nomeOriginal.length() - 1) {
                extensao = nomeOriginal.substring(ponto).toLowerCase();
            }

            // ExtensãoWhitelist: evita salvar arquivos executáveis com cara de imagem
            if (!EXTENSOES_PERMITIDAS.contains(extensao)) {
                extensao = ".jpg";
            }

            String nomeArquivo = UUID.randomUUID() + extensao;
            Path diretorio = Paths.get(uploadDir);

            if (!Files.exists(diretorio)) {
                Files.createDirectories(diretorio);
            }

            Path caminhoCompleto = diretorio.resolve(nomeArquivo);
            Files.copy(file.getInputStream(), caminhoCompleto, StandardCopyOption.REPLACE_EXISTING);

            log.info("Arquivo salvo: {}", caminhoCompleto);
            return baseUrl + nomeArquivo;
        } catch (IOException e) {
            log.error("Erro ao salvar arquivo", e);
            throw new RuntimeException("Não foi possível salvar o arquivo: " + e.getMessage());
        }
    }

    public void excluirArquivo(String url) {
        if (url == null || url.isEmpty()) {
            return;
        }

        try {
            String nomeArquivo = url.substring(url.lastIndexOf('/') + 1);
            Path caminho = Paths.get(uploadDir, nomeArquivo);
            Files.deleteIfExists(caminho);
        } catch (IOException e) {
            log.warn("Não foi possível excluir arquivo: {}", url, e);
        }
    }
}
