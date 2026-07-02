<div align="center">
  <h1>📼 K.I.C.K 📼</h1>
  <p><em>Keep It Cult, Kiddo — Sistema Brutalista de Arquivamento e Curadoria Cultural</em></p>

  <img src="https://img.shields.io/badge/Wasp-FCA311?style=for-the-badge&logo=wasp&logoColor=black" alt="Wasp" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</div>

<br />

## 📖 Sobre o Projeto

O **K.I.C.K** (*Keep It Cult, Kiddo*) é uma plataforma curatorial e de agregação de conteúdo para gerenciamento de acervo cultural. Nascido como um esforço acadêmico para imortalizar o efêmero, este sistema estrutura, organiza e preserva a memória da cultura — mas sem causar tanta polêmica (ainda). 

Com uma estética brutalista e uma arquitetura robusta por baixo dos panos, o K.I.C.K prova que arquivamento histórico não precisa ser entediante. Pelo contrário: se a sua submissão não estiver de acordo com os termos de uso, os curadores lhe dão um belo "strike" e você corre o risco de ser expurgado permanentemente do acervo! Do contrário, vai compartilhar com outros usuários o que VOCÊ considera cultura! 

> **Curadoria com Mão de Ferro** — Qualquer visitante pode consultar o acervo. Usuários logados podem submeter obras (HQs, Filmes, Fotografia, Memes, etc). Porém, absolutamente nada vai ao ar sem a aprovação de um Administrador. Não subimos nada "cegamente" justamente porque para nós, você decide o que é cultura e nós garantimos que a comunidade permaneça segura.

---

## ✨ Principais Funcionalidades

- 🏛️ **Acervo Público Dinâmico:** Um feed imersivo que exibe apenas as obras aprovadas. Visitantes podem visualizar tudo, mas apenas usuários de elite (cadastrados) podem favoritar as obras.
- 🗄️ **Indexação Leve:** Obras são registradas via URLs de imagens e arquivos relacionados (YouTube, Drive, etc). Preservamos a memória sem arrebentar com o disco do servidor hospedando gigabytes de vídeo-arte.
- ⚖️ **Dashboard do Curador (Olimpo da Moderação):** Uma interface administrativa onde o *Admin* julga as submissões pendentes. Aprovar traz a obra à luz do dia. Rejeitar aniquila o registro e pune o usuário.
- ⚡ **Sistema de Strikes Impiedoso:** Teve uma obra rejeitada por infringir os Termos de Uso? Tome um strike. Se acumular strikes, uma faixa vermelha de aviso ficará cravada na sua tela, lembrando-o de que sua conta e todas as suas obras estão por um fio de serem apagadas *permanentemente*.
- 🎨 **UI Brutalista e Reativa:** Efeitos de rastro no mouse (Tearing Background), tipografia agressiva, bordas grossas e suporte impecável a Dark/Light Mode.

| Funcionalidade | O que faz na prática |
| --- | --- |
| **Visitante** | Pode olhar, mas se tentar favoritar, leva um pop-up na cara mandando se registrar. |
| **Usuário (`USER`)** | Submete pérolas culturais para análise. Torce para não ser rejeitado. |
| **Administrador (`ADMIN`)** | Decide o que é cultura e o que é lixo. Aprova ou rejeita (expurga) as obras. |

---

## 🛠️ Arquitetura e Tecnologias

Um sistema brutalista no front, mas extremamente sofisticado no back, provando que é possível entregar um projeto Full Stack impecável.

| Camada | Tecnologia |
| --- | --- |
| **Orquestração** | Wasp (Gera o back e o front amarrados com tipagem forte) |
| **Frontend** | React, TailwindCSS, Lucide-React e Framer Motion |
| **Backend API** | Node.js + Express (gerado pelo Wasp) |
| **Banco de Dados** | SQLite gerenciado via Prisma ORM |
| **Autenticação** | Wasp Auth (Email/Senha) integrado |

---

## 🚀 Guia de Instalação (Sem Enrolação)

Siga os passos e levante o seu próprio acervo na sua máquina.

**Pré-requisitos:** Node.js (v18+) instalado.

### 1. Clonar e Instalar
```bash
git clone https://github.com/LeahRCS/K.I.C.K.git
cd kick-app
npm install
```

### 2. Configurar o Banco de Dados e Migrar
Prepare o SQLite e aplique o schema do Prisma:
```bash
npx wasp db migrate-dev
```

### 3. Popular o Acervo (Seed)
Precisamos das categorias clássicas e nichadas (HQ, Memes, Fotografia, Arte Contemporânea). Rode o seeder:
```bash
npx wasp db seed devSeedUsers
```

### 4. Criar o Usuário Administrador
Para testar o fluxo de aprovação/rejeição, você precisará de uma conta Admin.
Suba o servidor primeiro:
```bash
npx wasp start
```

Após o servidor iniciar, abra **outro terminal** na pasta do projeto e rode o script de automação que criamos para burlar a burocracia do envio de e-mail local e gerar seu Admin:
```bash
node create-admin.js
```
*(O script abrirá o Chromium, preencherá o cadastro, e injetará as credenciais de `ADMIN` e "email verificado" direto no SQLite. Genial, não?)*

**Credenciais do Admin gerado:**
- **Email:** `admin@acervo.org`
- **Senha:** `Acervo2026!`

### 5. Acesse o Acervo
Abra `http://localhost:3000` e divirta-se catalogando (e julgando) a cultura pop.

---

## 📁 Estrutura do Repositório

```
kick-app/
├── main.wasp              # O coração: define rotas, entidades, auth e queries
├── schema.prisma          # Tabelas: User, Work, Category, Collection, Favorite, History
├── src/
│   ├── client/            # Páginas React, Componentes e Efeitos Especiais (TearingBackground)
│   ├── server/            # Funções Node.js (Queries e Actions) tipadas pelo Wasp
│   └── shared/            # Componentes reaproveitáveis (Dialogs, Headers)
├── dbSeed.ts              # Script para popular categorias de submissão
└── create-admin.js        # Script de automação Puppeteer + SQLite
```

---

## 📜 Licença

MIT — Porque a cultura (e o código fonte) pertencem ao povo.

---

<div align="center">
  <br />
  <em>Desenvolvido com suor, café e estética brutalista pela mente de <a href="https://github.com/LeahRCS">Leah R.C.S.</a></em>
  <br /><br />
  <sub>Disciplina de Programação Full Stack — 2026</sub>
</div>
