# Dion Baci

Luxury fashion house website built for Dion Baci.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Prisma
- Supabase PostgreSQL
- Framer Motion
- TypeScript

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create local environment variables:

```bash
cp .env.example .env.local
```

3. Fill in your real values for:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_ADMIN_PASSCODE`

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Start the development server:

```bash
npm run dev
```

6. Open the app:

```bash
http://localhost:3000
```

## Database Notes

- Prisma schema lives in `prisma/schema.prisma`
- Supabase is used as the PostgreSQL provider
- For schema sync, use:

```bash
npx prisma db pull
```

or

```bash
npx prisma db push
```

depending on whether the database or the Prisma schema is the source of truth.

## Deployment

Deploy on Vercel.

Required environment variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_ADMIN_PASSCODE`

Recommended production steps:

1. Add the environment variables in Vercel project settings.
2. Run `npx prisma generate` during build.
3. Ensure the Supabase database accepts connections from the deployment environment.
4. Deploy the `main` branch.

## Project Structure

- `app/`
- `components/`
- `lib/`
- `public/images/`
- `prisma/`
