# 🗺️ Roadmap de Desenvolvimento — InstaDog

> Plano detalhado em fases e sprints para construir a rede social para cães. Pensado para uma pessoa desenvolvendo sozinha, com cerca de 10–15 horas por semana.

**Duração total estimada:** 12 semanas (MVP no ar na semana 8)
**Metodologia:** sprints de 1 semana, com quadro Kanban (GitHub Projects ou Trello)

---

## Visão Geral das Fases

| Fase | Semanas | Objetivo | Marco |
|---|---|---|---|
| 0. Descoberta | 1 | Planejar e desenhar | Escopo + Figma + diagrama ER |
| 1. Fundação | 2–3 | Infra, auth, perfis | Login funcionando com perfil de cão |
| 2. Núcleo social | 4–6 | Posts, feed, interações | Feed com curtidas e comentários |
| 3. Polimento e MVP | 7–8 | Testes, deploy, docs | **MVP no ar** |
| 4. Engajamento | 9–10 | Busca, notificações, chat | Versão 2 |
| 5. Diferenciais | 11–12 | Mapa, encontros, vacinas | Versão 3 |

---

## Fase 0 — Descoberta (Semana 1)

**Objetivo:** ter clareza do que será construído antes de escrever código.

### Tarefas
- [ ] Definir nome, slogan e identidade visual básica
- [ ] Escrever o escopo do MVP (o que entra e o que fica de fora)
- [ ] Criar user stories das funcionalidades principais
- [ ] Desenhar wireframes no Figma (login, feed, perfil, criar post)
- [ ] Modelar o banco e gerar o diagrama ER
- [ ] Escolher a stack definitiva
- [ ] Criar o repositório no GitHub com README inicial, `.gitignore` e licença
- [ ] Configurar o quadro Kanban com o backlog

### Entregáveis
- Documento de escopo
- Wireframes no Figma
- Diagrama ER
- Repositório e quadro criados

### Critério de pronto
Qualquer pessoa consegue ler o escopo e entender o que será entregue no MVP.

---

## Fase 1 — Fundação (Semanas 2–3)

### Sprint 1 (Semana 2): Ambiente e autenticação

**Back-end**
- [ ] Inicializar o projeto com Java e Spring Boot, utilizando Maven para gerenciamento de dependências.
- [ ] Configurar organização em camadas (Controller, Service, Repository e Entity).
- [ ] Configurar PostgreSQL local com Docker Compose.
- [ ] Implementar cadastro e login com hash de senha
- [ ] Gerar e validar JWT, com middleware de autenticação
- [ ] Validação de entrada e tratamento centralizado de erros

**Front-end**
- [ ] Inicializar projeto React + Vite + Tailwind
- [ ] Configurar roteamento e estrutura de pastas
- [ ] Telas de cadastro e login
- [ ] Guarda de rotas (rotas privadas)

**DevOps**
- [ ] Configurar CI no GitHub Actions (lint + build)

**Entregável:** usuário consegue se cadastrar, entrar e sair.

### Sprint 2 (Semana 3): Perfis de tutor e cão

- [ ] CRUD de perfil do tutor
- [ ] CRUD de cães (um tutor, vários cães)
- [ ] Upload de foto (Cloudinary/S3) com validação de tipo e tamanho
- [ ] Tela de perfil do tutor
- [ ] Tela de perfil do cão
- [ ] Formulário de cadastro de cão (nome, raça, nascimento, porte, bio)
- [ ] Documentar a API com Swagger

**Entregável:** usuário cria o perfil e cadastra seus cães com foto.

---

## Fase 2 — Núcleo Social (Semanas 4–6)

### Sprint 3 (Semana 4): Posts e feed

- [ ] Model e endpoints de Post
- [ ] Upload de imagem do post
- [ ] Criar post escolhendo qual cão aparece
- [ ] Listar posts do usuário no perfil (galeria)
- [ ] Feed global com **paginação** (cursor ou infinite scroll)
- [ ] Skeletons de carregamento e estado vazio
- [ ] Excluir o próprio post

**Entregável:** usuário publica fotos e vê o feed.

### Sprint 4 (Semana 5): Interações

- [ ] Curtir e descurtir (com atualização otimista no front)
- [ ] Comentar e excluir o próprio comentário
- [ ] Contadores de curtidas e comentários
- [ ] Seguir e deixar de seguir
- [ ] Feed filtrado por quem o usuário segue
- [ ] Índices no banco para as consultas do feed

**Entregável:** interação completa entre usuários.

### Sprint 5 (Semana 6): Experiência e responsividade

- [ ] Revisão de UI com o design do Figma
- [ ] Layout mobile-first e responsivo
- [ ] Mensagens de erro e feedback (toasts)
- [ ] Acessibilidade: alt nas imagens, foco, contraste
- [ ] Tela de edição de perfil
- [ ] Seed com dados de exemplo (usuários, cães, posts)

**Entregável:** aplicação coesa, bonita e usável no celular.

---

## Fase 3 — Polimento e MVP no ar (Semanas 7–8)

### Sprint 6 (Semana 7): Qualidade e segurança

- [ ] Testes unitários das regras de negócio
- [ ] Testes de integração dos endpoints principais
- [ ] Teste E2E do fluxo: cadastro → cão → post → curtida
- [ ] Rate limiting nas rotas de auth
- [ ] Revisão de CORS, headers de segurança (Helmet) e validações
- [ ] Verificar que nenhum segredo está no repositório
- [ ] Política de privacidade e opção de excluir conta (LGPD)
- [ ] Otimização de imagens (tamanhos e lazy loading)

### Sprint 7 (Semana 8): Deploy e apresentação

- [ ] Banco em Neon/Supabase/Railway
- [ ] Deploy da API (Render/Railway/Fly.io)
- [ ] Deploy do front-end (Vercel/Netlify)
- [ ] Pipeline de CI/CD com testes e deploy automático
- [ ] Conta demo com dados de exemplo
- [ ] README completo (screenshots, GIFs, diagramas, como rodar)
- [ ] Vídeo demo de 1–2 minutos
- [ ] Publicar no LinkedIn e adicionar ao portfólio

### 🎯 Marco: MVP publicado

**Critério de pronto do MVP**
- Fluxo principal funciona em produção sem erros
- Testes passando no CI
- README permite que outra pessoa rode o projeto localmente
- Responsivo e acessível no básico

---

## Fase 4 — Engajamento (Semanas 9–10)

### Sprint 8 (Semana 9): Busca e notificações

- [ ] Busca por nome, raça e cidade
- [ ] Hashtags nos posts
- [ ] Notificações de curtida, comentário e novo seguidor
- [ ] Contador de notificações não lidas
- [ ] Marcar como lida

### Sprint 9 (Semana 10): Mensagens

- [ ] Mensagens diretas com Socket.IO
- [ ] Lista de conversas
- [ ] Indicador de mensagem não lida
- [ ] Login com Google (OAuth)

**Marco:** versão 2 publicada.

---

## Fase 5 — Diferenciais (Semanas 11–12)

### Sprint 10 (Semana 11): Mapa e encontros

- [ ] Cadastro de locais pet-friendly (parques, cafés, petshops)
- [ ] Mapa com Leaflet e busca por proximidade
- [ ] Criar eventos/encontros com data e local
- [ ] Confirmar presença em eventos

### Sprint 11 (Semana 12): Saúde e adoção

- [ ] Carteira de vacinação do cão
- [ ] Lembretes de próxima dose
- [ ] Seção de adoção com perfis de ONGs
- [ ] Transformar em PWA (instalável no celular)

**Marco:** versão 3 publicada, com os diferenciais do portfólio.

---

## Backlog Futuro (opcional)

- Stories de 24 horas
- Identificação de raça por foto com IA
- Gerador de legendas divertidas
- Gamificação e conquistas
- Marketplace de serviços (passeadores, banho e tosa)
- Painel de moderação e denúncias
- App mobile com React Native

---

## Gestão do Projeto

### Rotina semanal
| Dia | Atividade |
|---|---|
| Início da semana | Planejar o sprint e mover cards para "A fazer" |
| Durante | Commits pequenos e frequentes, um card por vez |
| Fim da semana | Revisão, deploy de staging e retrospectiva rápida |

### Boas práticas
- Commits semânticos (`feat:`, `fix:`, `docs:`, `chore:`)
- Um branch por funcionalidade e Pull Request mesmo trabalhando sozinho
- Atualizar o README ao final de cada sprint
- Registrar decisões técnicas em `docs/decisoes.md`

### Definição de pronto (para cada tarefa)
- [ ] Funciona conforme o esperado
- [ ] Tem testes nas partes críticas
- [ ] Sem erros de lint
- [ ] Responsivo
- [ ] Documentado quando necessário

---

## Riscos e Como Lidar

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Escopo crescer demais | Alta | Congelar o MVP e mandar ideias novas para o backlog |
| Perder motivação | Média | Entregas semanais visíveis e compartilhar o progresso |
| Custos de hospedagem | Baixa | Usar planos gratuitos e limites de upload |
| Upload de imagens pesado | Média | Compressão, limites de tamanho e CDN |
| Prazo estourar | Alta | Cortar funcionalidades da Fase 4–5, nunca a qualidade do MVP |
| Falta de tempo para testes | Média | Reservar a Semana 7 só para qualidade |

---

## Métricas de Sucesso

- MVP no ar até a semana 8
- Pelo menos 3 pessoas testando e dando feedback
- CI verde com cobertura nas partes críticas
- README com screenshots, demo e link funcionando
- Projeto apresentado no LinkedIn e no portfólio

---

## Se o tempo for curto

**Plano enxuto de 6 semanas:** faça as Fases 0 a 3, comprimindo:
- Semana 1: planejamento
- Semana 2: auth + perfis
- Semana 3: posts e feed
- Semana 4: curtidas, comentários e seguir
- Semana 5: testes e responsividade
- Semana 6: deploy e documentação

---

**Lembre-se:** o MVP no ar vale mais do que um projeto enorme na máquina local. 🐾
