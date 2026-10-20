# 🐾 InstaDog

Rede social para cães — conectando tutores e seus melhores amigos.

## 📋 Sobre o projeto

O InstaDog é uma rede social focada em cães, onde tutores podem criar perfis para seus pets, publicar fotos, curtir, comentar e seguir outros cães.

Desenvolvido como projeto de portfólio por uma pessoa, com cerca de 10–15 horas por semana.

## 🗺️ Roadmap

O planejamento detalhado está em `roadmap-instadog.md`, dividido em 5 fases e 11 sprints:

| Fase | Semanas | Objetivo |
|------|---------|----------|
| 0. Descoberta | 1 | Escopo, Figma, diagrama ER |
| 1. Fundação | 2–3 | Infra, auth, perfis |
| 2. Núcleo social | 4–6 | Posts, feed, interações |
| 3. Polimento e MVP | 7–8 | Testes, deploy, docs |
| 4. Engajamento | 9–10 | Busca, notificações, chat |
| 5. Diferenciais | 11–12 | Mapa, encontros, vacinas |

**MVP previsto:** semana 8

## 🛠️ Stack

- **Back-end:** Java 17 + Spring Boot 3 + Maven + PostgreSQL + JWT + Spring Security
- **Front-end:** React 18 + Vite + Tailwind CSS + React Router + Axios
- **Deploy:** Render/Railway (API) + Vercel/Netlify (Front)

## 🚀 Como rodar localmente

### Pré-requisitos
- Java 17+
- Maven
- Node.js 18+
- PostgreSQL (ou Docker)

### Back-end
```bash
cd backend
./mvnw spring-boot:run      # Linux/macOS
mvnw.cmd spring-boot:run     # Windows
```

Se preferir usar o Maven do sistema: `mvn spring-boot:run`.

### Front-end
```bash
cd frontend
npm install
npm run dev
```

### Banco de dados (Docker)
```bash
docker-compose up -d
```

### Variáveis de ambiente
| Variável | Onde | Padrão |
|----------|------|--------|
| `VITE_API_URL` | `frontend/.env` | `/api` (proxy do Vite em dev) |
| `INSTADOG_CORS_ORIGINS` | `backend/.env` | `http://localhost:5173` |
| `INSTADOG_JWT_SECRET` | `backend/.env` | valor de desenvolvimento |
| `SPRING_DATASOURCE_URL` | `backend/.env` | `jdbc:postgresql://localhost:5432/instadog` |

Copie os arquivos de exemplo: `cp backend/.env.example backend/.env` e
`cp frontend/.env.example frontend/.env`.

### Contas de demonstração

O seed cria **10 tutores, 19 cães, 26 publicações, 76 curtidas, 21 comentários e 27 vínculos de seguir**,
com fotos reais (dog.ceo), datas distribuídas ao longo das últimas semanas e perfis completos.

| E-mail | Senha | Tutor |
|--------|-------|-------|
| `demo@instadog.com` | `demo123` | Demo Tutor (conta principal, 2 dogs) |
| `ana@instadog.com` | `123456` | Ana Silva — Rio de Janeiro |
| `carlos@instadog.com` | `123456` | Carlos Mendes — Belo Horizonte |
| `bea@instadog.com` | `123456` | Beatriz Costa — Curitiba |
| `rafael@instadog.com` | `123456` | Rafael Lima — Recife |
| `julia@instadog.com` | `123456` | Júlia Almeida — Porto Alegre |
| `marcos@instadog.com` | `123456` | Marcos Pereira — Salvador |
| `larissa@instadog.com` | `123456` | Larissa Souza — Brasília |
| `pedro@instadog.com` | `123456` | Pedro Henrique — Curitiba |
| `camila@instadog.com` | `123456` | Camila Rocha — Florianópolis |

**Recriar os dados de demonstração** (apaga tudo e reseeda):

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.arguments=--instadog.seed.reset=true
```

Desligar o seed: `INSTADOG_SEED_ENABLED=false`.

### Problemas comuns

| Sintoma | Causa | Solução |
|---------|-------|---------|
| `No plugin found for prefix 'spring-boot'` | Comando rodado na raiz do projeto | `cd backend` antes de rodar o Maven |
| `'mvnw' não é reconhecido` | Wrapper não baixado | Use `mvnw.cmd` (Windows) ou rode `mvn wrapper:wrapper` |
| `InstaDog exige Java 17 ou superior` | `JAVA_HOME` apontando para JDK antigo | Instale o JDK 17+ e ajuste `JAVA_HOME` |
| `Connection to localhost:5432 refused` | Banco não está no ar | `docker-compose up -d` na raiz do projeto |
| `Port 8080 was already in use` | Outra instância do back-end rodando | `netstat -ano \| findstr :8080` e finalize o processo, ou mude `SERVER_PORT` |
| Seed não roda | Banco já tem dados | `docker-compose down -v && docker-compose up -d` para recriar do zero |

## 📄 Licença

MIT

## 🐾 Detalhes que diferenciam

- **Perfil estilo Orkut**: banner, menu de estatísticas, lista de amigos e o
  **mural de recados (scraps)** — dá para deixar recado no perfil de outro
  tutor em `/perfil/{id}`
- **Feed paginado** com filtro "Todos" / "Seguidos"
- **Curtidas otimistas**, comentários inline e exclusão dos próprios posts
- **Upload de imagens** com validação de tipo, tamanho e extensão
- **Seed de demonstração** com 10 tutores, 19 cães, 26 posts, 81 curtidas,
  22 comentários, 27 vínculos de amigo e 20 recados

