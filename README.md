# Camer SIRH

Application web professionnelle de gestion RH : employés, ouvriers, sanctions, paie, documents et vérification par QR code.

## Stack

- Next.js 16 (App Router, TypeScript strict)
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- Auth.js (NextAuth v5)
- Zod, React Hook Form, TanStack Table, Recharts

## Installation

```bash
pnpm install
```

## Variables d'environnement

Copiez `.env.example` vers `.env` puis renseignez au minimum :

```bash
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

Générez un secret :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database

Démarrez PostgreSQL, appliquez les migrations, puis chargez les données de démo :

```bash
pnpm db:setup
```

Équivalent manuel :

```bash
docker compose up -d postgres
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed
```

Attendez que PostgreSQL soit prêt avant `migrate` : `docker compose up -d` démarre le conteneur, mais la base n’accepte pas encore les connexions immédiatement.

## Development

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Production

```bash
pnpm build
pnpm start
```

## Docker

```bash
docker compose --profile full up -d --build
```

Le service `app` est derrière le profil `full`. En local, vous pouvez ne lancer que PostgreSQL.

## Comptes de démonstration

Mot de passe commun : `Demo123!`

| Rôle | E-mail |
| --- | --- |
| Administrateur | `admin@camer-sirh.local` |
| Responsable RH | `rh.manager@camer-sirh.local` |
| Employé | `jean.dupont@camer-sirh.local` |

## Architecture

```text
app/            routes App Router
components/     UI, layout, modules
lib/auth        Auth.js + gardes RBAC
lib/services    règles métier
lib/repositories accès données
lib/permissions permissions serveur
lib/storage     stockage local (S3/MinIO prêt)
prisma/         schéma, seed
```

Les pages orchestrent l'interface. Les permissions sont vérifiées côté serveur, pas seulement dans l'UI.

## Vérification QR

Chaque bulletin généré reçoit une référence `DOC-AAAA-XXXXXX` et un QR code public :

```text
/verify/DOC-2026-000001
```

## Stockage

- Développement : fichiers dans `uploads/`
- Production : prévoir `STORAGE_DRIVER=s3` + MinIO/S3 via les variables `S3_*`

## Qualité

```bash
pnpm lint
pnpm typecheck
pnpm build
```
