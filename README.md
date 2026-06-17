# Neura Recruitment

Premium construction recruitment website built with Next.js, Tailwind CSS, Framer Motion, and Supabase.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Run the migration in `supabase/migrations/001_initial.sql`
   - Add your project URL and keys to `.env.local`

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/` — Homepage with hero, stats, expertise, journey, and CTAs
- `/jobs` — Filterable opportunity listings (static seed data)
- `/apply` — Worker vs client path selection and forms
- `/candidates` — Candidate benefits and apply CTAs
- `/employers` — Hiring outcomes and enquiry form
- `/about` — Company story, mission, vision
- `/contact` — Contact details and forms

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- Supabase (forms + CV storage)
- TypeScript + Zod

## Mobile

The site is built mobile-first with responsive navigation, touch-friendly CTAs (44px minimum), horizontal scroll timeline on small screens, and a sticky mobile CTA.

## Assets

See [docs/assets.md](docs/assets.md) for stock media sources and replacement instructions.
