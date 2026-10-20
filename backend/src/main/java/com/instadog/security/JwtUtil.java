package com.instadog.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Getter
    @Value("${instadog.jwt.secret}")
    private String secret;

    @Value("${instadog.jwt.expiration:86400000}")
    private long expiration;

    private SecretKey getSignInKey() {
        // Aceita segredos em base64url (padrão) ou texto puro.
        // Texto puro é normalizado com SHA-256 para garantir os 256 bits exigidos pelo HS256.
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64URL.decode(secret);
        } catch (DecodingException | IllegalArgumentException e) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }

        if (keyBytes.length < 32) {
            keyBytes = normalizar(keyBytes);
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    private byte[] normalizar(byte[] keyBytes) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(keyBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo SHA-256 indisponível nesta JVM", e);
        }
    }

    public String gerarToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    public <T> T extrairClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extrairTodosOsClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extrairTodosOsClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValido(String token, UserDetails userDetails) {
        final String email = extrairEmail(token);
        return (email.equals(userDetails.getUsername())) && !isTokenExpirado(token);
    }

    private boolean isTokenExpirado(String token) {
        return extrairExpiracao(token).before(new Date());
    }

    public Date extrairExpiracao(String token) {
        return extrairClaim(token, Claims::getExpiration);
    }
}
