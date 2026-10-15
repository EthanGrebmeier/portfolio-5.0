# Ethan Grebmeier’s portfolio

A Next.js App Router site using React, TypeScript, Tailwind CSS v4, and Motion.

## Requirements

- **Node.js 24.x** (also pinned in `.nvmrc` and `package.json`)
- **pnpm 10.34.7**, pinned in `package.json` for reproducible installs

With nvm and Corepack available:

```sh
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
```

Set `EMAIL_ADDRESS` and `EMAIL_TOKEN` in `.env` to enable the contact form. For Gmail, use an app password rather than your account password. Never commit credentials.

## Development and validation

```sh
pnpm dev        # Development server
pnpm check      # ESLint (zero warnings), route/type generation, and tests
pnpm build      # Production build
pnpm start      # Serve the production build
```

Individual checks are available as `pnpm lint`, `pnpm typecheck`, and `pnpm test`.

## Deploying to Vercel

1. In **Project Settings → Build and Deployment**, select **Node.js 24.x**.
2. Use the **Next.js** framework preset. Remove any overrides that still select Node.js 20.
3. Add `EMAIL_ADDRESS` and `EMAIL_TOKEN` to the appropriate deployment environments.
4. Leave install/build commands at their defaults, or use `pnpm install --frozen-lockfile` and `pnpm build`.
5. Redeploy. Existing deployments do not change runtime until a new build is deployed.

The `engines.node` field also declares Node.js 24.x so the repository and deployment runtime stay aligned. Build-time environment validation is enabled by default. `SKIP_ENV_VALIDATION=1` is intended only for builds that deliberately lack runtime credentials, not as a substitute for configuring production variables.

## Maintenance notes

- Tailwind v4 uses CSS-first configuration in `src/styles/globals.css` and the `@tailwindcss/postcss` plugin. There is no longer a `tailwind.config.ts`.
- Motion is imported from `motion/react`; a separate direct `framer-motion` dependency is unnecessary.
- Node.js type definitions intentionally target version 24, not the newest Node.js major.
- TypeScript stays on 6.0.x because the current `typescript-eslint` release does not support TypeScript 7. ESLint stays on 9.x because Next.js’s React, accessibility, and import plugins do not yet declare ESLint 10 support. Revisit these pins when their peer dependencies support newer majors.
- pnpm stays on the supported 10.x line for deployment/tooling compatibility.
- Run `pnpm audit --prod` to check runtime dependencies. At the time of this update, it reports no vulnerabilities. The full audit reports one unpatched high-severity `braces` advisory in Next.js’s development-only ESLint dependency chain; no suppression or incompatible override is applied.
- The contact form uses plain-text email, bounded input validation, and a best-effort **global, per-instance** limit of three attempts per minute (including invalid submissions). For reliable distributed/per-client abuse protection on serverless deployments, use a shared rate-limit store or deployment-level firewall rules; in-memory state is not shared between instances.
