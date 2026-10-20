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
- Token inválido ou expirado não derruba a requisição: o filtro segue sem autenticar
  e deixa a rota protegida retornar 401/403 normalmente
- Ao carregar a página, o front busca `/usuarios/perfil` para restaurar a sessão
  (o token continua no `localStorage`, mas o usuário precisa ser recarregado)

### CORS
- Configurado em `config/CorsConfig.java` via `CorsConfigurationSource`
- Origens permitidas pela propriedade `instadog.cors.origins` (separadas por vírgula)
- Em produção, definir `INSTADOG_CORS_ORIGINS` com o domínio do front-end

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
- Feed global (todos os posts) e feed de seguidos (`GET /api/posts?seguidos=true`)

### Upload de imagens
- Endpoint genérico `POST /api/upload` (multipart, campo `file`), usado por
  foto de perfil, foto do cão e imagem do post
- Valida tipo (apenas `image/*`), tamanho (máx. 10MB) e extensão (whitelist)
- Arquivos servidos estaticamente em `/uploads/**` (acesso público, sem token)
- Em produção, trocar o disco local por Cloudinary/S3 (disco do Render é efêmero)

### Exclusão de conta (LGPD)
- `DELETE /api/usuarios/perfil` remove o usuário e suas dependências:
  curtidas, comentários, posts e cães em cascade, e os vínculos de `seguir`

### Seed de demonstração
- `config/DemoData.java` guarda os dados fictícios (tutores, cães, publicações,
  comentários, vínculos de seguir e recados) e `config/DataSeeder.java` grava tudo
- Controlado por `instadog.seed.enabled` e `instadog.seed.reset`
- As datas de criação são reposicionadas depois da inserção (SQL nativo), para
  que o feed e o mural pareçam um histórico real em vez de tudo no mesmo instante
- As fotos usam a API pública dog.ceo e os avatares o pravatar.cc

### Recados (scraps) — perfil no estilo Orkut
- Entidade `Scrap` com autor, destinatário, texto e data
- `GET /api/scraps/usuario/{id}`, `POST /api/scraps/usuario/{id}`,
  `DELETE /api/scraps/{id}` (só o autor apaga o próprio recado)
- O perfil tem layout de duas colunas: menu de estatísticas/amigos/cães à
  esquerda e o mural de recados à direita
- Rota `/perfil/:usuarioId` para o perfil público de outro tutor, onde o
  visitante pode deixar recados — como no Orkut

## Próximos passos

1. Instalar Maven: https://maven.apache.org/install.html
2. Subir banco: `docker-compose up -d`
3. Rodar back-end: `mvn spring-boot:run` (dentro de `backend/`)
4. Rodar front-end: `cd frontend && npm install && npm run dev`
5. Acessar Swagger: `http://localhost:8080/swagger-ui.html`
