This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## SaaS console

- Public site: `/[locale]` (home), `/industries` (benefit-led overview), `/industries/{industry}` (stakeholder benefits + demo videos), `/industries/{industry}/{capability}` (16 detail pages), `/pricing` (per-camera pricing + calculator). `/solutions` redirects to `/industries`.
- Auth: `/[locale]/login`, `/[locale]/register` → signed httpOnly cookie (`AUTH_SECRET`, required in production). Users are stored in `.data/users.json` (gitignored; memory fallback on read-only filesystems) — swap `lib/auth/users.ts` for a real database before production.
- Demo org (Pro plan): `demo@sightai.example` / `sightai-demo` (seeded in `lib/auth/users.ts`, shown on the sign-in page).
- Console: `/[locale]/console` — overview, capability subscriptions (server-side via `/api/account`), industry dashboards, events, video sources, API keys, plan & billing, settings. Sources / events / keys are deterministic demo data persisted per user in `localStorage` (`lib/console/mock.ts`).
- Catalog: `content/industries.ts` (16 capabilities), `content/audiences.ts` (who benefits per industry), `content/capability-details/` (long-form copy per capability).
- Pricing: `content/plans.ts`, billed per camera per year in USD. Basic = $500 / camera / year; the Pro price ($800) is a placeholder to confirm.
