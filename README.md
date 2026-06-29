# NodeBase

NodeBase is a workflow automation platform built with Next.js. It lets users create visual workflows, connect trigger and action nodes, execute workflows, and inspect execution history from a dashboard.
The app is centered around a node-based editor backed by Prisma and PostgreSQL. Workflows are stored as graph data made of nodes and connections, then executed through Inngest.

## What It Does

NodeBase provides:

- Authentication and protected dashboards
- A visual workflow editor for building node graphs
- Workflow execution and execution history tracking
- Credential management for external services
- Subscription and billing flows
- Support for trigger and action nodes such as manual triggers, HTTP requests, Google Forms, Stripe, OpenAI, Anthropic, Gemini, Discord, and Slack

## Workflow

The typical flow in NodeBase is:

1. Sign in or create an account.
2. Create a workflow from the dashboard.
3. Open the editor and place nodes on the canvas.
4. Connect nodes with edges to define the execution path.
5. Attach credentials where a node needs access to external APIs.
6. Save the workflow.
7. Execute the workflow manually or through a trigger.
8. Review the resulting execution record in the executions area.

## Tech Stack

- Next.js 15 with the App Router
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- tRPC for type-safe client/server communication
- Inngest for background workflow execution
- better-auth for authentication
- Polar for subscriptions and billing
- React Flow / XYFlow for the visual editor
- Tailwind CSS and Radix UI for styling and UI primitives
- Sentry for error monitoring

## Project Structure

- `src/app` contains the route groups for auth, dashboard, editor, and API endpoints.
- `src/feature` contains product domains such as workflows, executions, credentials, auth, triggers, and subscriptions.
- `src/components` contains shared UI and editor node components.
- `src/trpc` contains the tRPC client and server setup.
- `src/inngest` contains the workflow execution client, functions, and utilities.
- `prisma/schema.prisma` defines the database models for users, sessions, credentials, workflows, nodes, connections, and executions.

## Data Model

The schema is organized around these core entities:

- `User` owns workflows, credentials, sessions, and accounts.
- `Workflow` stores the workflow metadata and the graph container.
- `Node` stores individual workflow nodes with type, position, and node data.
- `Connection` stores edges between nodes.
- `Credential` stores encrypted service credentials by provider type.
- `Execution` stores workflow run status, output, and errors.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- A package manager such as npm, pnpm, yarn, or bun

### Install

```bash
npm install
```

### Environment

Create a `.env` file with the required values for the app, database, auth, billing, and integrations. The exact variables depend on your local setup and connected services.

### Database

Run Prisma migrations after configuring your database connection:

```bash
npx prisma migrate dev
```

If you need the generated Prisma client:

```bash
npx prisma generate
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` starts the Next.js dev server with Turbopack.
- `npm run build` creates a production build.
- `npm run start` starts the production server.
- `npm run lint` runs Biome checks.
- `npm run format` formats the codebase with Biome.
- `npm run inngest:dev` starts the local Inngest developer server.
- `npm run ngrok:dev` exposes the app through the configured ngrok tunnel.
- `npm run dev:all` starts the multi-process dev setup through `mprocs`.

## Notes

- The dashboard sidebar exposes workflows, credentials, executions, billing portal access, and subscription upgrade actions.
- New workflows start with an initial node and can be updated by saving the graph back to the server.
- Workflow execution is delegated to Inngest so runs can be processed asynchronously.

## Deployment

This app is designed to run as a Next.js application with a PostgreSQL database and the external services used for authentication, billing, and workflow execution.
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
