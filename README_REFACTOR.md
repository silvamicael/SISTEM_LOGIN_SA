# Refatoração enxuta do backend

A estrutura original foi mantida, mas as avaliações foram unificadas.

## Mudanças principais

- `avaliacaoDiagnostica.model.js` e `avaliacaoProgresso.model.js` viraram um único `Avaliacao.model.js`.
- Toda a lógica de avaliação está em `avaliacao.controller.js`.
- O campo `tipo` diferencia avaliações `diagnostica` e `progresso`.
- `plano.controller.js` ficou responsável somente por consultar planos.
- As URLs antigas de diagnóstico e progresso foram mantidas em `plano.routes.js`.
- Associações Sequelize foram centralizadas em `models/index.js`.
- O servidor foi corrigido para iniciar apenas uma vez.
- A autenticação foi padronizada para os perfis `ALUNO` e `ADMIN`.

## Observação sobre o banco

A nova versão usa a tabela `avaliacoes`. As tabelas antigas de avaliações não são apagadas automaticamente. Faça backup antes de remover tabelas antigas no Supabase.

## Execução

```bash
cd BackEnd
cp .env.example .env
npm install
npm run dev
```
