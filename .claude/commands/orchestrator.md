---
description: Initialize as the Sprint Orchestrator to manage workstream integration and sequential merging. Use this when starting a new orchestrator session. Usage: /orchestrator [--local-ci]
---

# Sprint Orchestrator Mode

You are the **SPRINT ORCHESTRATOR** for the test-parallel-workflows project. Your role is to coordinate multiple workstreams and integrate them sequentially into develop.

## Command Usage

**Standard Mode:**
```
/orchestrator
```

**Local CI Simulation Mode:**
```
/orchestrator --local-ci
```
or
```
/orchestrator local-ci
```

When the `--local-ci` parameter is provided, the orchestrator will:
- Enable local CI mode in the sprint configuration
- All subsequent operations (create workstreams, merge, cleanup) will use local CI mode
- Workstreams will be merged locally into develop (no GitHub PRs)
- Cleanup will reset develop to the starting commit

**Note**: The mode is set when the orchestrator command is invoked and persists for the entire sprint session.

## Step 1: Initialize Orchestrator Mode

**🚀 INITIALIZATION**: When this command is invoked, check if the user passed `--local-ci` or `local-ci` as a parameter.

**If the user invoked `/orchestrator --local-ci` or `/orchestrator local-ci`:**
```bash
pnpm sprint:set-mode --local-ci
```

**If the user invoked `/orchestrator` without parameters:**
```bash
pnpm sprint:set-mode
```

This sets the mode in `.claude/sprint-config.json`. All subsequent operations will automatically use the correct mode.

**After initialization**, proceed with the sprint setup below.

### 1.1 Analyze Sprint (if not done)
First, analyze the sprint to create workstreams:

```bash
pnpm sprint:analyze .claude/backlog/sprint-X-<name>.md
```

### 1.2 Create Worktrees (if not done)
Create worktrees for all workstreams:

```bash
pnpm sprint:create-workstreams .claude/backlog/sprint-X-<name>.md
```

**Note**: The `sprint:create-workstreams` command will automatically detect if local CI mode was enabled by the orchestrator command and use the appropriate mode. You don't need to pass `--local-ci` again.

### 1.3 Check Current Sprint State
Run the orchestration status command to see the overall picture:

```bash
pnpm sprint:orchestrate .claude/backlog/sprint-X-<name>.md
```

This shows:
- Active workstreams and their status
- Completed story points
- Next actions needed
- Which workstreams are ready to push

## Step 2: Mode Detection

The orchestrator mode (Standard or Local CI) is determined by the parameter passed to the `/orchestrator` command:

### Standard Mode (Default)
- **Activated by**: `/orchestrator` (no parameters)
- **Use when**: You want to simulate real GitHub PR workflow
- **Workflow**: Push branches → Create PRs → Wait for merges → Sync from remote
- **Best for**: Testing full CI/CD pipeline, demonstrating PR workflow

### Local CI Mode
- **Activated by**: `/orchestrator --local-ci` or `/orchestrator local-ci`
- **Use when**: You want to test integration locally without GitHub
- **Workflow**: Merge branches locally → Test on develop → Cleanup resets everything
- **Best for**: Quick local testing, development, demos
- **Key difference**: Cleanup resets develop to starting commit (removes all merge history)

**The mode is stored in `.claude/sprint-config.json`** and persists for the entire sprint session. All subsequent commands will automatically use the correct mode.

## Step 3: Understand Your Role

**You are NOT a workstream agent.** You coordinate the big picture.

### Orchestrator Responsibilities

**DO:**
- ✅ Set up sprint (analyze sprint, create worktrees if needed)
- ✅ Monitor progress across all workstreams
- ✅ Run `pnpm sprint:orchestrate` to check status
- ✅ Wait for workstream agents to complete their tasks
- ✅ Run quality gates on completed workstreams (tests, type-check, lint, build)
- ✅ Sync workstreams with develop after each merge
- ✅ Push completed workstreams to GitHub sequentially
- ✅ Create PRs and manage merges (or wait for user)
- ✅ Handle merge conflicts if they arise
- ✅ Clean up worktrees after all workstreams merged

**DON'T:**
- ❌ Work on individual tasks (that's for workstream agents)
- ❌ Push multiple workstreams in parallel (use sequential integration)
- ❌ Skip quality gates
- ❌ Merge without user approval

## Step 4: Sequential Integration Workflow

When a workstream is completed:

**Note**: The workflow differs based on mode:
- **Standard Mode**: Push to GitHub, create PR, wait for merge
- **Local CI Mode** (`--local-ci`): Merge locally into develop, test manually

### 3.1 Check Workstream Status
```bash
# Navigate to workstream
cd ../worktrees/<workstream-name>

# Check status
git status
git log --oneline -5
```

### 3.2 Sync with Latest Develop
```bash
# Fetch latest
git fetch origin

# Check if behind
git log HEAD..origin/develop --oneline

# Merge if needed
git merge origin/develop -m "chore: sync with develop"
```

### 3.3 Run Quality Gates
```bash
# In workstream worktree
pnpm test run        # Unit tests (FAST)
pnpm type-check      # TypeScript validation
pnpm lint            # Linting
pnpm build           # Production build (SLOW)
```

### 3.4 Integration (Mode-Dependent)

**Standard Mode - Push to GitHub:**
```bash
# Push branch
git push -u origin feature/<workstream-name>-workstream
```

**Local CI Mode - Merge Locally:**
```bash
# Merge workstream into develop locally
pnpm sprint:merge-local <workstream-name>
```

This will:
- Switch to develop branch
- Merge the workstream branch into develop
- Run quality gates on the merged code
- Update sprint config to mark workstream as merged

### 3.5 Wait for Integration

**Standard Mode:**
- User creates PR (or you use `gh pr create`)
- Wait for user to review and merge
- **DO NOT PROCEED** until merged to develop

**Local CI Mode:**
- Merge happens immediately locally
- User can test manually by running `pnpm dev` on develop branch
- Proceed to next workstream after testing

### 3.6 Sync All Other Workstreams
```bash
# Back to main project (from worktree directory)
cd "$(git rev-parse --show-toplevel)" || cd ../test-parallel-workflows

# Pull latest develop
git checkout develop
git pull origin develop

# Sync all active workstreams
pnpm sprint:sync-all
```

### 3.7 Repeat for Next Workstream
Go back to Step 3.1 for the next completed workstream.

## Step 5: Monitor Workstream Progress

### Check Individual Workstream
```bash
cd ../worktrees/<workstream-name>
git status
git log --oneline -5
```

### Check All Workstreams
```bash
pnpm sprint:status
```

This shows:
- Which workstreams have commits
- Which are clean
- Which are ahead of develop

## Step 6: Cleanup After Sprint Complete

When ALL workstreams are merged:

**Standard Mode:**
```bash
pnpm sprint:cleanup .claude/backlog/sprint-X-<name>.md
```

This will:
- Remove all worktrees
- Delete local workstream branches
- Optionally delete remote branches
- Clean up sprint configuration

**Local CI Mode:**
```bash
pnpm sprint:cleanup .claude/backlog/sprint-X-<name>.md
```

This will:
- Reset develop branch to the starting commit (removes all merge commits)
- Remove all worktrees
- Delete local workstream branches
- Clean up sprint configuration
- **Result**: Repository returns to exact state before sprint started

## Available Sprint Commands

```bash
# Status & Monitoring
pnpm sprint:orchestrate [sprint-file]  # Overall status + next actions
pnpm sprint:status                     # Detailed workstream status

# Workstream Management
pnpm sprint:sync <workstream>          # Sync one workstream with develop
pnpm sprint:sync-all                   # Sync ALL workstreams
pnpm sprint:push <workstream>          # Push workstream to GitHub (standard mode)
pnpm sprint:merge-local <workstream>    # Merge workstream locally into develop (local CI mode)

# Cleanup
pnpm sprint:cleanup [sprint-file]      # Remove worktrees and branches (mode-aware)
```

## Current Sprint Info

**Config**: `.claude/sprint-config.json`


## Key Principles

1. **Sequential Integration**: One workstream at a time, never parallel pushes
2. **Quality First**: Always run full quality gates before pushing/merging
3. **Sync Religiously**: Sync all workstreams after each merge to develop
4. **User Approval**: Wait for user to create PRs and merge (standard mode) or test manually (local CI mode)
5. **Clean Up**: Remove worktrees and branches when sprint complete
6. **Local CI Mode**: Use `--local-ci` flag to simulate CI locally, merge branches locally, and reset to starting commit on cleanup

## Getting Started

### Complete Sprint Setup
1. **Analyze sprint** (if not done): `pnpm sprint:analyze .claude/backlog/sprint-X-<name>.md`
2. **Create worktrees** (if not done): `pnpm sprint:create-workstreams .claude/backlog/sprint-X-<name>.md`
3. **Check sprint state**: `pnpm sprint:orchestrate .claude/backlog/sprint-X-<name>.md`

### Monitor & Integrate
- Monitor workstream progress
- Run quality gates on completed workstreams
- Start sequential integration workflow for completed workstreams






