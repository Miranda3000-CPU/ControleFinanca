# Controle de Finanças v2 (Uso Pessoal)

Aplicação Next.js + Prisma para controle financeiro pessoal com:
- Login único via `.env`
- CRUD completo de compras
- Upload de comprovante (imagem/PDF) salvo em base64 no Postgres
- Busca e paginação server-side (20 por página)
- PWA instalável (manifest + ícones)

## Configuração de ambiente

`.env` necessário:

```env
DATABASE_URL="..."
AUTH_SECRET="..."
ADMIN_USER="admin"
ADMIN_PASSWORD="12345678"
```

## Banco de dados

```bash
npm install
npm run db:generate
npm run db:push
```

## Executar local

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Enum no banco

- `PurchaseCategory`: `ALIMENTACAO`, `MORADIA`, `TRANSPORTE`, `SAUDE`, `EDUCACAO`, `LAZER`, `ASSINATURAS`, `OUTROS`
- `PaymentType`: `CARTAO_CREDITO`, `CARTAO_DEBITO`, `PIX`, `DINHEIRO`, `TRANSFERENCIA`, `BOLETO`
