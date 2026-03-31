# Controle de Finanças v2

Aplicação web para controle financeiro pessoal, construída com Next.js + Prisma + PostgreSQL.

## Visão geral

O projeto oferece um dashboard privado com login único (credenciais no `.env`) para registrar e acompanhar gastos e ganhos.

### Funcionalidades

- Login com sessão JWT em cookie `httpOnly`
- CRUD completo de lançamentos financeiros
- Tipo de lançamento: `GASTO` e `GANHO`
- Filtros por produto, categoria e tipo de pagamento
- Paginação server-side (`20` registros por página)
- Cards de resumo (gastos, ganhos, saldo e total de itens)
- Gráfico mensal dos últimos 6 meses
- Upload de comprovante (imagem/PDF até 2MB)
- Visualização de comprovante direto no histórico
- PWA instalável (`manifest` + ícones)

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS 4
- Zod (validação)
- JOSE (JWT)

## Requisitos

- Node.js 20+
- npm 10+
- Banco PostgreSQL disponível

## Configuração

### 1) Instalar dependências

```bash
npm install
```

### 2) Configurar variáveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

```bash
cp .env.example .env
```

Variáveis usadas pela aplicação:

- `DATABASE_URL`: string de conexão PostgreSQL
- `AUTH_SECRET`: segredo para assinar/verificar JWT da sessão
- `ADMIN_USER`: usuário do login único
- `ADMIN_PASSWORD`: senha do login único

Exemplo mínimo:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
AUTH_SECRET="um-segredo-longo-e-seguro"
ADMIN_USER="admin"
ADMIN_PASSWORD="troque-por-uma-senha-forte"
```

### 3) Preparar banco de dados

```bash
npm run db:generate
npm run db:push
```

Opcional (ver dados no Prisma Studio):

```bash
npm run db:studio
```

## Executando o projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Produção local

```bash
npm run build
npm run start
```

## Scripts disponíveis

- `npm run dev`: inicia ambiente de desenvolvimento
- `npm run build`: build de produção
- `npm run start`: sobe app em modo produção
- `npm run lint`: executa ESLint
- `npm run db:generate`: gera cliente Prisma
- `npm run db:migrate`: cria/aplica migration em desenvolvimento
- `npm run db:push`: sincroniza schema no banco sem migration
- `npm run db:studio`: abre Prisma Studio

## Modelo de dados

Tabela principal: `Purchase`

Campos relevantes:

- `purchaseDate`: data da compra
- `product`: descrição do item
- `category`: categoria da compra
- `paymentType`: forma de pagamento
- `entryType`: `GASTO` ou `GANHO`
- `amountInCents`: valor em centavos
- `receiptBase64`, `receiptMimeType`, `receiptFileName`, `receiptSize`: comprovante opcional

Enums:

- `PurchaseCategory`: `ALIMENTACAO`, `MORADIA`, `TRANSPORTE`, `SAUDE`, `EDUCACAO`, `LAZER`, `ASSINATURAS`, `OUTROS`
- `PaymentType`: `CARTAO_CREDITO`, `CARTAO_DEBITO`, `PIX`, `DINHEIRO`, `TRANSFERENCIA`, `BOLETO`
- `EntryType`: `GASTO`, `GANHO`

## Regras importantes do sistema

- Upload de comprovante aceita apenas imagem ou PDF
- Tamanho máximo do comprovante: 2MB
- Sessão com cookie seguro e duração de 30 dias
- Rotas protegidas redirecionam para `/login` sem sessão válida
- A raiz `/` redireciona automaticamente para `/dashboard` ou `/login`

## Estrutura de pastas

```text
prisma/
  schema.prisma
src/
  app/
    dashboard/
    login/
  components/
    dashboard/
  lib/
public/
  icons/
```

## Observações

- Este projeto foi pensado para uso pessoal (single-user), sem cadastro multiusuário.
- Para ambientes de produção, use credenciais fortes e `AUTH_SECRET` robusto.
