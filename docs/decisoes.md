# Decisões Técnicas — InstaDog

## Stack escolhida

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Linguagem back-end | Java 17 | Maturidade, ecossistema Spring, suporte a LTS |
| Framework back-end | Spring Boot 3 | Padrão de mercado, starter dependencies, segurança integrada |
| Build | Maven | Gerenciamento de dependências amplamente adotado em Java |
| Banco de dados | PostgreSQL | Relacional, bom para dados estruturados de rede social |
| ORM | Spring Data JPA + Hibernate | Produtividade, integração nativa com Spring |
| Autenticação | JWT (stateless) | Simples para MVP, sem sessão no servidor |
| Documentação API | SpringDoc OpenAPI (Swagger) | Geração automática de documentação |
| Front-end | React 18 + Vite | Build rápido, ecossistema grande |
| Estilização | Tailwind CSS | Desenvolvimento rápido de UI responsiva |
| Roteamento | React Router | Padrão para SPAs em React |
| HTTP client | Axios | Interceptors simples, suporte a cancelamento |
| Banco local dev | Docker Compose (PostgreSQL) | Isolamento, fácil de subir e derrubar |

## Decisões de arquitetura

### Camadas (back-end)
- **Controller**: recebe requisições HTTP, valida entrada, retorna respostas
- **Service**: regras de negócio, transações (`@Transactional`)
- **Repository**: acesso a dados via Spring Data JPA
- **Entity**: mapeamento objeto-relacional com Lombok

### Autenticação
- Stateless com JWT armazenado em `localStorage` no front-end
- Filtro `JwtAuthFilter` extrai o token do header `Authorization: Bearer <token>`
- Senhas hasheadas com BCrypt (`PasswordEncoder`)

### Entidades principais
- `Usuario`: tutor (login, perfil)
- `Cao`: cão pertencente a um usuário (1:N)
- `Post`: publicação de um cão (1:N com curtidas e comentários)
- `Curtida`: curtida de um post por um usuário (única por usuário+post)
- `Comentário`: comentário em um post
- `Seguir`: relacionamento de seguir entre usuários

### Feed
- Paginação com `Pageable` do Spring Data
- Ordenação por data de criação decrescente
- Feed global (todos os posts) — filtro por seguidos pode ser adicionado na Fase 4

### Upload de imagens
- Preparado em `application.properties` (`spring.servlet.multipart.*`)
- Integração com Cloudinary/S3 pode ser adicionada na Fase 1 (Sprint 2)

## Próximos passos (Fase 1 cont.)

1. Instalar Maven: https://maven.apache.org/install.html
2. Subir banco: `docker-compose up -d`
3. Rodar back-end: `./mvnw spring-boot:run` (ou `mvn spring-boot:run`)
4. Rodar front-end: `cd frontend && npm install && npm run dev`
5. Acessar Swagger: `http://localhost:8080/swagger-ui.html`
