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
./mvnw spring-boot:run
```

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

## 📄 Licença

MIT
