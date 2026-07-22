# 🔐 SISTEM_LOGIN

API REST de autenticação de usuários, desenvolvida com foco em boas práticas de segurança, organização de código e arquitetura backend.

---

## 📌 Visão Geral

O **SISTEM_LOGIN** implementa um fluxo completo de autenticação, incluindo:

- Registro de usuários  
- Login com validação de credenciais  
- Criptografia de senhas  
- Estrutura modular (MVC)  

Ideal como base para sistemas maiores que exigem controle de acesso.

---

## 🚀 Tecnologias

- Node.js  
- Express  
- Sequelize (ORM)  
- MySQL  
- bcrypt  
- dotenv  

---

## 🧱 Arquitetura

```bash

src/
├─ config/ # Conexão com banco
├─ models/ # Entidades
├─ controllers/ # Regras de negócio
├─ routes/ # Rotas
└─ middlewares/ # Validações e autenticação

````
---

## ⚙️ Setup

```bash
git clone https://github.com/silvamicael/SISTEM_LOGIN.git
cd SISTEM_LOGIN
npm install

Crie um arquivo .env:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=sistema_login
JWT_SECRET=seu_token

Execute:

npm run dev

````

## 🔌 API

````bash
Auth
Método	Endpoint	Descrição
POST	/register	Criar usuário
POST	/login	  Autenticar

````

---

## 🔐 Segurança

````bash
Hash de senha com bcrypt
Validação de entrada
Estrutura preparada para JWT
Separação de responsabilidades

````
---

## 📈 Possíveis Evoluções
- Autenticação com JWT
- Refresh Token
- Controle de roles (admin/user)
- Recuperação de senha
- Logs e auditoria

---

## 👨‍💻 Autor

Micael Schosek da Silva.  
https://github.com/silvamicael
