# 🎓 Plataforma Web de Aprendizagem Adaptativa com IA

Projeto desenvolvido para a **Situação de Aprendizagem (SA)** do curso **Técnico em Desenvolvimento de Sistemas**, com foco na criação de uma plataforma web capaz de personalizar o processo de aprendizagem por meio de **Inteligência Artificial**.

---
LINK DO DEPLOY: https://sistem-login-sa.vercel.app/dashboard
---

---

## 📖 Sobre o projeto

A proposta desta aplicação é oferecer uma experiência de aprendizagem mais personalizada, utilizando IA para:

- gerar trilhas de estudo;
- identificar o nível atual do aluno;
- criar avaliações diagnósticas;
- montar planos de estudo personalizados;
- acompanhar a evolução do usuário ao longo do tempo.

A plataforma foi construída com arquitetura **full stack**, utilizando **React** no frontend, **Node.js + Express** no backend e **PostgreSQL** como banco de dados.

---

## ✨ Funcionalidades principais

### 👤 Autenticação e usuário
- Cadastro de usuário
- Login com autenticação JWT
- Perfil do usuário
- Atualização de dados pessoais
- Desativação de conta

### 🧠 Inteligência Artificial
- Geração de trilhas personalizadas com Gemini
- Geração de avaliação diagnóstica com IA
- Geração de avaliação de progresso com IA
- Geração de plano de estudo adaptativo
- Geração de feedback automático

### 📚 Trilhas e aprendizagem
- Escolha de área de interesse
- Definição de nível atual
- Definição de nível desejado
- Geração de opções de trilha personalizadas
- Escolha da trilha ideal

### 📝 Avaliações e progresso
- Avaliação diagnóstica
- Classificação de nível do aluno
- Avaliação de progresso
- Histórico de desempenho
- Atualização do plano de estudos com base nos resultados

---

## 🛠️ Tecnologias utilizadas

### 🎨 Frontend
- React
- Vite
- JavaScript
- CSS

### ⚙️ Backend
- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- Gemini API

### 🗄️ Banco de dados
- PostgreSQL
- Supabase

---

## 📁 Estrutura do projeto

```bash
SISTEM_LOGIN_SA/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Perfil.jsx
│   │   │   ├── Trilhas.jsx
│   │   │   ├── Avaliacao.jsx
│   │   │   └── Planos.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── BackEnd/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cors.js
│   │   │   ├── database.js
│   │   │   ├── helmet.js
│   │   │   └── rateLimit.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── trilha.controller.js
│   │   │   ├── plano.controller.js
│   │   │   └── avaliacao.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Trilha.model.js
│   │   │   ├── Plano.model.js
│   │   │   ├── Avaliacao.model.js
│   │   │   └── index.js
│   │   │
│   │   ├── router/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── trilha.routes.js
│   │   │   └── plano.routes.js
│   │   │
│   │   ├── services/
│   │   │   └── gemini.service.js
│   │   │
│   │   └── app.js
│   │
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
---

````

## ⚙️ Setup

```bash

git clone https://github.com/silvamicael/SISTEM_LOGIN_SA.git
cd SISTEM_LOGIN_SA
npm install

Crie um arquivo .env:

PORT=3000
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=sua_chave_gemini
DATABASE_URL=sua_url_do_postgresql

Criar um arquivo .env no frontend com:

VITE_API_URL=http://localhost:3000

Rodar o projeto

Backend
npm run dev

Frontend
npm run dev


````

## 🎯 Objetivo acadêmico

````bash

Este projeto foi desenvolvido com foco em aplicar conhecimentos de:

desenvolvimento web full stack;
integração entre frontend e backend;
autenticação com JWT;
modelagem e integração com banco de dados relacional;
consumo de API de inteligência artificial;
organização e estruturação de projeto;
desenvolvimento de sistemas com foco em personalização do ensino.

````

## 📌 Observações

````bash

A geração de trilhas, avaliações e planos depende da integração com a Gemini API.
O projeto pode utilizar fallbacks em etapas específicas durante testes, dependendo da configuração adotada.
O banco de dados utilizado é o PostgreSQL, podendo ser hospedado no Supabase.
````

## 👨‍💻 Autor

Micael Schosek da Silva.  
https://github.com/silvamicael
