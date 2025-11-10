# CLAUDE.md

Entry point for Claude Code when working on this repository.

---

## 🎯 Quick Start by Scenario

### Starting Sprint Orchestrator Mode
**Just say**: `/orchestrator`
**What it does**: Initializes you as the Sprint Orchestrator to coordinate multiple workstreams
**See**: [Sprint Workstreams Workflow](./.claude/workflow/sprint-workstreams.md#role-initialization) | [Orchestrator Command](./.claude/commands/orchestrator.md)

### Starting Sprint 3+ Workstream Agent Mode
**Just say**: `/workstream-agent <workstream-name>`
**What it does**: Initializes you as a Workstream Agent to work on specific tasks
**See**: [Sprint Workstreams Workflow](./.claude/workflow/sprint-workstreams.md#role-initialization) | [Workstream Agent Command](./.claude/commands/workstream-agent.md)

Manual steps if needed:
1. Read: [Development Workflow](./.claude/workflow/development-workflow.md) (MANDATORY)
2. Check: [Current sprint status](./.claude/backlog/) for next task
3. Confirm: You're on clean `develop` branch
4. Check: Context7 MCP for library documentation

Manual steps if needed:
1. Check: [Development Workflow §1.4](./.claude/workflow/development-workflow.md#14-syncing-with-develop-hybrid-strategy) (sync with develop)
2. Review: Quality gates before committing (§1.5)
3. Update: Sprint status when complete (see [Sprint Status Management](./.claude/workflow/sprint-status-management.md))

### Understanding the Codebase
1. Start: [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
3. Review: Modern tech stack (see below)

---

## 📋 Current Sprint

**No active sprint** - Ready to start a new sprint

**Available Sprint Backlogs**:
- [Sprint 1: Hello API (Simplified Demo)](./.claude/backlog/sprint-1-hello-api.md) - Fast demo sprint (~45 min, 3 SP)

👉 **To start a sprint**: Run `pnpm sprint:analyze .claude/backlog/sprint-1-hello-api.md` to begin orchestration

---

## 📚 Essential Documentation

### System Validation
- **System Evaluation**: [Complete test results and validation](./docs/EVALUATION.md) ✅ **100% Test Success Rate**
- **Cleanup Documentation**: [Environment cleanup and maintenance](./docs/CLEANUP.md)


### MANDATORY Before Coding
- [Development Workflow](./.claude/workflow/development-workflow.md) - Complete workflow (read sections 1.1-1.6)
  - Quality gates: tests → types → lint → build → coverage approval
  - TDD cycle: Red → Green → Refactor
  - Coverage validation workflow (user approval required)
- [Sprint Status Management](./.claude/workflow/sprint-status-management.md) - How to update task status

### Reference (As Needed)
- [Git Workflow](./.claude/workflow/git-workflow.md) - Version control guidelines
- [Sprint Backlog](./.claude/backlog/) - Task breakdown and status

---

## 🛠️ Modern Tech Stack

**Framework**: Next.js 16 (App Router) + React 19 + TypeScript
**Styling**: Tailwind CSS + shadcn/ui

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for complete details.

---

## ⚡ Essential Commands

```bash
# Quality Gates (run in this order before commit)
pnpm test run        # Unit tests (FAST - run first)
pnpm type-check      # TypeScript checking
pnpm lint            # Linting
pnpm build           # Production build (SLOW - run last)
pnpm test:coverage   # Coverage report → user approval required

# Development
pnpm dev             # Start dev server (http://localhost:3000)

# E2E Testing
pnpm test:e2e        # Playwright E2E tests
```

---

## 🎯 Project Overview

**E-Commerce Landing Page** - Next.js 16 application demonstrating parallel development workflows

**Business Focus**: Online retail and e-commerce platform
**Languages**: English (primary)
**SEO Keywords**: "online shopping", "e-commerce", "products", "subscribe"
**Author**: Marc Torrent Vernetta

---

## 📞 Getting Help

- **Documentation**: Check `.claude/` and `docs/` directories first
- **Issues**: https://github.com/anthropics/claude-code/issues





