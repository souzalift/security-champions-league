# 🛡️ Security Champions League

![Next.js](https://img.shields.io/badge/Next.js-14.2.0-blue.svg?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8.svg?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748.svg?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📌 Visão Geral

O **Security Champions League** é um sistema completo de gerenciamento de torneios de futsal, desenvolvido com **Next.js App Router**, **Prisma ORM**, **Autenticação via NextAuth** e upload de imagens via **UploadThing**. Ele oferece funcionalidades para usuários e administradores acompanharem e gerenciarem o campeonato em tempo real.

---

## 🔧 Tecnologias e Ferramentas

- ⚛️ **Next.js 14** (App Router + SSR)
- 💅 **Tailwind CSS** para estilização
- 🧩 **Shadcn/UI** para componentes acessíveis e modernos
- 🔐 **NextAuth.js** para autenticação de administradores
- 🔄 **Prisma ORM** com PostgreSQL
- ☁️ **UploadThing** para upload de imagens
- 🍃 **Supabase** como banco PostgreSQL e storage opcional
- 🔔 **Sonner** para toasts

---

## ✨ Funcionalidades

### 👤 Público

- 📋 Visualização de **classificação geral**
- 📅 Lista de **jogos agendados** e **finalizados**
- ⚽ Página de **artilharia**
- 📣 Leitura do **regulamento oficial**
- 📝 Página de **inscrição** de equipes (formulário com validação e envio de logo)
- 📱 Design **responsivo**

### 🧑‍💼 Admin

- 🔐 Login com autenticação protegida
- 📥 **Painel de inscrições pendentes**
  - ✅ Aprovar inscrição (transforma em equipe oficial)
  - ❌ Rejeitar inscrição
  - ✏️ Editar equipe (nome, capitão, contato, jogadores, fotos, logo)
- ✅ **Lista de equipes aprovadas**
- ❌ **Lista de equipes rejeitadas** (com opção de restaurar ou excluir)
- ⚙️ **Gerenciar partidas**
  - Adicionar novo jogo
  - Editar resultados e gols por jogador
  - Excluir partidas agendadas ou finalizadas
- 📈 Atualização automática da classificação

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/security-champions-league.git
cd security-champions-league

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Rode as migrations
npx prisma migrate dev

# Inicie o servidor
npm run dev
```

## 🔐 Variáveis de Ambiente (.env)

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
```

## 🖼️ Imagens e Uploads

- Upload da logo da equipe na inscrição
- Upload da foto dos jogadores (via admin)
- Armazenadas com UploadThing

## 📄 Licença

Este projeto está licenciado sob os termos da MIT License.

## 🌐 Acesso

🔗 https://security-champions-league.vercel.app

## 💡 Créditos

Desenvolvido por Souzalift usando a stack Next.js + Prisma + Tailwind + UploadThing + Shadcn.
