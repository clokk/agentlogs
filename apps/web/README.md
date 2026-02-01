# CogCommit Web

The web platform for CogCommit, built with Next.js 14.

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase project (for database)

### Environment Variables

Create a `.env.local` file:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# GitHub OAuth (for login)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Running Locally

```bash
# From repo root
pnpm dev --filter=web

# Or from this directory
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Building

```bash
# From repo root
pnpm build --filter=web

# Or from this directory
pnpm build
```

## Architecture

```
app/
├── (marketing)/          # Public pages (landing, features, docs)
├── (dashboard)/          # Authenticated dashboard
│   └── dashboard/        # Main dashboard
│       ├── page.tsx      # Commit list
│       ├── commits/[id]/ # Commit detail
│       └── settings/     # User settings
├── (auth)/               # Authentication
│   ├── login/            # Login page
│   └── callback/         # OAuth callback
└── api/                  # API routes
    ├── commits/          # Commit CRUD
    └── projects/         # Project list

components/
├── ConversationView.tsx  # Simplified viewer for detail page
├── DashboardClient.tsx   # Main dashboard component
└── ...

lib/
├── supabase/             # Supabase client setup
│   ├── client.ts         # Browser client
│   └── server.ts         # Server client
└── hooks/                # React Query hooks
```

## Deployment

The app is deployed to Vercel. Push to `main` triggers automatic deployment.

### Vercel Environment Variables

Configure these in the Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## Supabase Schema

The web app reads from these Supabase tables:

- `cognitive_commits` - Main commit data
- `sessions` - Claude sessions within commits
- `turns` - Individual turns within sessions
- `user_profiles` - User profile data

See `packages/supabase/src/` for query functions and transforms.
