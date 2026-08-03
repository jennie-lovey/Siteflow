# SiteFlow

A construction project manager: set up a project with a status and priority, build a versioned
cost estimate that exports as a PDF quotation, track daily site expenses and notes once work
starts, and see budget-vs-actual and profit at a glance.

## One-time setup

### 1. Create a Supabase project

SiteFlow stores all data in [Supabase](https://supabase.com) (a hosted Postgres database). This
is the one part you need to do yourself — sign up and create a free project at
[supabase.com](https://supabase.com/dashboard).

### 2. Run the schema

In your new Supabase project, open **SQL Editor → New query**, paste the contents of
[`supabase/schema.sql`](supabase/schema.sql), and run it. This creates all the tables and a
`project_financials` view the app depends on.

### 3. Connect the app to your project

In your Supabase project, go to **Project Settings → API** and copy the **Project URL** and the
**anon public** key. Create a `.env.local` file in this folder (copy `.env.example`) and fill
them in:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes on data access

There is no login in this app — it's built for a single user. The database uses Row Level
Security with fully open policies for the anon key, so anyone who has your Supabase URL and anon
key (both of which end up in the browser bundle) could read or write your data. That's an
accepted tradeoff for a private, single-user tool. If you ever deploy this somewhere public
(e.g. Vercel), keep the URL to yourself, and consider adding a simple PIN gate in front of it.

Deleting a project is a soft delete (it's hidden from the dashboard, not erased) — you can restore
it by clearing `deleted_at` on the row directly in the Supabase table editor if needed.
