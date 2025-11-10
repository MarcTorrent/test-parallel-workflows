# Test Parallel Workflows

This is a **testing and demonstration project** for parallel development workflows using Next.js 16, React 19, and TypeScript.

## 🎯 Project Purpose

This project is designed to **test and demonstrate** a sprint workstream orchestration system that enables:
- **Parallel development** across multiple workstreams (frontend, backend, testing)
- **Git worktree management** for isolated development branches
- **Sequential integration** workflow with quality gates
- **Automated sprint orchestration** via CLI scripts

**Note**: This is a **testing/demo project**. The features implemented are intentionally simple to focus on demonstrating the workflow system rather than complex business logic.

## 🏗️ Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit tests) + Playwright (E2E tests)
- **Workflow System**: Custom sprint orchestration scripts

## 🚀 Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Sprint Workflow Commands

```bash
# Analyze sprint and create workstreams
pnpm sprint:analyze .claude/backlog/sprint-1-hello-api.md

# Create worktrees for all workstreams
pnpm sprint:create-workstreams .claude/backlog/sprint-1-hello-api.md

# Check sprint orchestration status
pnpm sprint:orchestrate .claude/backlog/sprint-1-hello-api.md

# Check workstream status
pnpm sprint:status

# Sync all workstreams with develop
pnpm sprint:sync-all

# Clean up worktrees and branches
pnpm sprint:cleanup .claude/backlog/sprint-1-hello-api.md
```

### Quality Gates

```bash
# Run quality gates (in order)
pnpm test run        # Unit tests (FAST)
pnpm type-check      # TypeScript checking
pnpm lint            # Linting
pnpm build           # Production build (SLOW)
```

## 📋 Available Sprints

- **[Sprint 1: Hello API (Simplified Demo)](.claude/backlog/sprint-1-hello-api.md)** - Fast demo sprint (~45 min, 3 story points)

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Entry point for Claude Code with workflow commands
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture details
- **[docs/EVALUATION.md](./docs/EVALUATION.md)** - System evaluation and test results
- **[docs/CLEANUP.md](./docs/CLEANUP.md)** - Environment cleanup procedures
- **[.claude/workflow/](./.claude/workflow/)** - Detailed workflow documentation

## 🧪 Testing

This project includes comprehensive testing for the workflow system:

- **Unit Tests**: Component and API route testing with Vitest
- **E2E Tests**: Integration testing with Playwright
- **System Evaluation**: Complete validation of orchestrator and workstream agent workflows

See [docs/EVALUATION.md](./docs/EVALUATION.md) for complete test results.

## 📝 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## 🚢 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
