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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## VPS + SQLite migration

This version no longer uses Firebase at runtime. The website reads catalog/content from a local SQLite database on the VPS and saves contact/product enquiries to SQLite.

### Requirements
- Node.js 22.5+ (the project uses Node's built-in `node:sqlite`)
- A writable `data/` directory

### First-time migration from the old Firestore catalog
The migration utility is included as `scripts/migrate-firestore.mjs`. It requires Firestore access only during the one-time migration and does not add Firebase SDKs to the website.

Set these variables temporarily on the VPS (or set `FIREBASE_SERVICE_ACCOUNT_FILE` to a service-account JSON file):
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Then run:

```bash
npm install
npm run migrate:firebase
npm run build
npm start
```

The migration stores Firestore documents in `data/catalog.db` while preserving their original document paths. This keeps the existing catalog/visibility behavior without changing the website's product functionality.

Do not commit or upload service-account credentials. The provided `.env.example` is only a template.
