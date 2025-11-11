# Sprint Orchestration Framework
## Parallel Development with Git Worktrees

**Presentation Document**  
*Complete framework overview and setup guide*

---

## Table of Contents

1. [The Problem](#1-the-problem)
2. [The Solution](#2-the-solution)
3. [Core Concepts](#3-core-concepts)
4. [Architecture](#4-architecture)
5. [Workflow Overview](#5-workflow-overview)
6. [Agent Autonomy Setup](#6-agent-autonomy-setup)
7. [Execution Modes](#7-execution-modes)
8. [Commands Reference](#8-commands-reference)
9. [Benefits & Value](#9-benefits--value)
10. [System Validation](#10-system-validation)
11. [Demo Sprint](#11-demo-sprint)
12. [Live Demo Script](#12-live-demo-script)

---

## 1. The Problem

### Traditional Feature Branch Workflow Bottlenecks

❌ **Sequential PR Creation**
- Each workstream requires separate PR creation
- Manual GitHub UI interaction for each PR
- PR merges must be sequential (one at a time)

❌ **Context Switching Overhead**
- Slow `git checkout` between branches
- Cannot run multiple dev servers simultaneously
- Lost context when switching between workstreams

❌ **Development Friction**
- Cannot test multiple features in parallel
- Merge conflicts discovered late in the process
- Difficult to coordinate parallel development

### Impact

- **Slower development cycles**
- **Reduced parallelization opportunities**
- **Increased merge conflict risk**
- **Lower team productivity**

---

## 2. The Solution

### Sprint Workstreams with Git Worktrees

✅ **True Parallelization**
- Multiple workstreams work simultaneously in isolated worktrees
- Each workstream has its own complete codebase
- Parallel dev servers on different ports

✅ **Instant Context Switching**
- `cd` instead of `git checkout`
- No lost context between workstreams
- All workstreams accessible simultaneously

✅ **Orchestrated Integration**
- One PR per workstream (not one per task)
- Sequential integration with automatic conflict resolution
- Quality gates before integration

✅ **Complete Isolation**
- Worktrees provide perfect development isolation
- No interference between parallel workstreams
- Safe parallel development

---

## 3. Core Concepts

### Workstream Definition

A **workstream** is a collection of related tasks that can be worked on by a single agent in sequence.

**Characteristics:**
- Related tasks grouped together
- Assigned to a single agent
- Can be developed in parallel with other workstreams
- Minimal file conflicts with other workstreams

### Worktree Strategy

Each workstream gets its own **worktree** (complete codebase copy), allowing multiple agents to work in parallel without conflicts.

**Key Points:**
- Each worktree is a complete copy of the codebase
- Each worktree has its own branch
- Changes are isolated until merge
- Multiple worktrees can exist simultaneously

### Agent Assignment

Each workstream is assigned to a **single agent** who handles all tasks within that workstream sequentially.

**Agent Responsibilities:**
- Complete all tasks in assigned workstream
- Work autonomously in isolated worktree
- Run quality gates before commits
- Report completion to orchestrator

### Orchestrator Role

The **orchestrator** coordinates the big picture:
- Monitors progress across all workstreams
- Runs quality gates on completed workstreams
- Handles sequential integration
- Syncs workstreams after each merge
- Manages cleanup

---

## 4. Architecture

### Directory Structure

```
<your-workspace>/
├── test-parallel-workflows/     (main repository)
│   ├── .claude/
│   │   ├── sprint-config.json   (workstream tracking)
│   │   └── backlog/
│   │       └── sprint-1-*.md    (sprint definition)
│   ├── scripts/                 (sprint automation)
│   └── src/                     (application code)
│
└── worktrees/                   (sibling directory, created automatically)
    ├── frontend/                 (worktree for frontend workstream)
    │   ├── src/                  (complete codebase copy)
    │   └── .git/                 (linked to main repo)
    ├── backend/                  (worktree for backend workstream)
    └── testing/                  (worktree for testing workstream)
```

**Important Notes:**
- Worktrees are created in a `worktrees/` directory **sibling** to the main repository
- The exact path depends on where you cloned the repository
- All paths in documentation use relative paths (`../worktrees/<name>`) for portability

### Git Branch Structure

```
develop (remote origin)
├── feature/frontend-workstream   (worktree: ../worktrees/frontend/)
├── feature/backend-workstream    (worktree: ../worktrees/backend/)
└── feature/testing-workstream    (worktree: ../worktrees/testing/)
```

**Integration Flow:**
1. Agents work in parallel on separate branches
2. Orchestrator pushes workstreams sequentially
3. Each workstream merges to develop one at a time
4. Other workstreams sync with updated develop after each merge

### Component Overview

```
┌─────────────────────────────────────────────────────────┐
│                    SPRINT ORCHESTRATOR                  │
│  • Monitors all workstreams                             │
│  • Runs quality gates                                   │
│  • Handles sequential integration                       │
│  • Syncs workstreams after merges                      │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  Workstream  │ │  Workstream │ │  Workstream │
│   Agent 1    │ │   Agent 2   │ │   Agent 3   │
│  (Frontend)  │ │  (Backend)  │ │  (Testing)  │
└───────┬──────┘ └─────┬──────┘ └─────┬──────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
            ┌───────────▼───────────┐
            │   Git Worktrees      │
            │  (Isolated Copies)   │
            └──────────────────────┘
```

---

## 5. Workflow Overview

### Phase 1: Sprint Analysis and Workstream Creation (Orchestrator)

**Analyze sprint and create workstreams:**

```bash
# Analyze sprint backlog for workstreams
pnpm sprint:analyze .claude/backlog/sprint-1-hello-api.md
```

**Output:** Workstream analysis with dependencies and recommendations

**Create workstreams:**

```bash
# Create all workstreams and worktrees
pnpm sprint:create-workstreams .claude/backlog/sprint-1-hello-api.md
```

**What happens:**
1. Creates worktrees: `../worktrees/<workstream-1>/`, etc.
2. Creates branches: `feature/<workstream-1>-workstream`, etc.
3. Updates sprint file with workstream status
4. Sets up isolated development environments

### Phase 2: Workstream Execution (Agents)

**Each agent works in their assigned worktree with FULL AUTONOMY:**

```bash
# Agent 1: Frontend
cd ../worktrees/frontend/
pnpm dev --port 3001
# Work on tasks autonomously - NO PERMISSION NEEDED

# Agent 2: Backend  
cd ../worktrees/backend/
pnpm dev --port 3002
# Work on tasks autonomously - NO PERMISSION NEEDED

# Agent 3: Testing
cd ../worktrees/testing/
# Wait for dependencies, then work autonomously
```

**Key Points:**
- Agents work **simultaneously** in parallel
- Each agent has **complete autonomy** in their worktree
- No interference between workstreams
- Parallel dev servers on different ports

### Phase 3: Workstream Completion (Agents)

**When workstream is complete:**

```bash
# Agent completes workstream
pnpm sprint:complete <workstream-name>
```

**What happens:**
1. Updates sprint file: workstream status = "ready_for_integration"
2. Shows completion summary
3. Reports to orchestrator

### Phase 4: Orchestrator Integration (Orchestrator)

**Push workstream to GitHub (Standard Mode):**

```bash
# Orchestrator pushes workstream
pnpm sprint:push <workstream-name>
```

**Or merge locally (Local CI Mode):**

```bash
# Orchestrator merges locally
pnpm sprint:merge-local <workstream-name>
```

**What happens:**
1. Quality gates run automatically
2. Workstream pushed/merged
3. PR created (standard mode) or merged locally (local CI mode)
4. Status updated

### Phase 5: GitHub Actions Validation (Automatic)

**GitHub Actions run on the workstream branch:**
- All checks must pass (same as regular PRs)
- Tests, linting, type checking, build

### Phase 6: Merge PR (User/Orchestrator)

**Standard Mode:**
- Review PR in GitHub UI
- Verify all checks passed ✅
- Click "Merge pull request"

**Local CI Mode:**
- Merge happens automatically
- Test manually on develop branch

### Phase 7: Orchestrator Sync (Orchestrator)

**After PR is merged, sync all other workstreams:**

```bash
# Update local develop
git checkout develop
git pull origin develop

# Sync all other workstreams with updated develop
pnpm sprint:sync-all
```

**What happens:**
1. Updates local develop with merged changes
2. Syncs all other workstreams with updated develop
3. Resolves conflicts if any
4. Updates sprint file with sync status

### Phase 8: Continue Work (Agents)

**Other workstreams continue with updated develop:**
- Agents continue working in their worktrees
- Now have merged workstream changes
- Continue with remaining tasks

### Phase 9: Repeat Process

**Repeat phases 3-8 for each workstream:**
1. Complete workstream
2. Push/merge workstream
3. GitHub Actions validation
4. Merge PR
5. Sync all other workstreams
6. Continue work

### Phase 10: Cleanup (Orchestrator)

**After all workstreams are complete:**

```bash
# Clean up worktrees and branches
pnpm sprint:cleanup .claude/backlog/sprint-1-hello-api.md
```

**What happens:**
1. Confirms all workstreams are complete
2. Syncs `develop` branch
3. Removes all worktrees
4. Deletes local workstream branches
5. Updates sprint file with completion status

---

## 6. Agent Autonomy Setup

### The Challenge

Without proper configuration, Cursor agents will prompt for **every file edit**, breaking the autonomous parallel workflow.

### The Solution: Cursor Configuration

Agents need to be configured to work **without permission prompts** in their worktrees.

### Configuration Steps

#### Step 1: Access Cursor Settings

1. Open Cursor Settings:
   - `Cmd/Ctrl + Shift + J` (Mac/Windows)
   - Or `Cmd/Ctrl + Shift + P` → "Cursor Settings"

2. Navigate to:
   - **Features** → **Agent** → **Tools**
   - Or **Agent** → **Advanced Options**

#### Step 2: Configure Auto-Run Mode ⚠️ CRITICAL

**Setting:** `Auto-Run Mode` (dropdown)

**Location:** `Cursor Settings` → `Agents` → `Auto-Run` section

**Action:** Set to **"Run Everything (Unsandboxed)"**

**What it does:**
- Enables automatic execution of terminal commands
- Enables automatic file edits
- Allows `pnpm sprint:resume` and file edits to run without prompts

**This is the main setting that controls automatic execution.**

#### Step 3: Configure Protection Settings

**Location:** `Cursor Settings` → `Agents` → `Auto-Run` section

**Settings to configure:**

| Setting | Value | Reason |
|---------|-------|--------|
| **External-File Protection** | ⚠️ **OFF** | **CRITICAL FOR WORKTREES** - Worktrees are in `../worktrees/` (sibling directory), which Cursor treats as "external" to the workspace. Must be OFF for worktree edits to work automatically. |
| **File-Deletion Protection** | ✅ **ON** | Prevents auto-deletion - keep ON for safety |
| **Dotfile Protection** | ✅ **ON** | Prevents modifying .gitignore, etc. - keep ON for safety |
| **Browser Protection** | ⚠️ **OFF** | Allows browser tools - adjust as needed |

**Why External-File Protection is Critical:**

Since worktrees are in `../worktrees/` (sibling directory), Cursor treats them as "external" to the workspace. The **External-File Protection** setting blocks edits there unless disabled.

**Options:**

1. **Disable External-File Protection** (Quick Fix)
   - ✅ Worktree file edits work automatically
   - ⚠️ Less safe - allows edits outside workspace in general
   - **Recommendation:** Only if you trust the worktree workflow

2. **Add Worktrees to Workspace** (Better Solution)
   - In Cursor: `File` → `Add Folder to Workspace...`
   - Add the `worktrees/` directory (or individual worktree folders)
   - ✅ Worktrees become part of workspace, External-File Protection won't block them
   - ✅ More secure
   - **Recommendation:** Best long-term solution

3. **Accept Prompts** (Safest)
   - Keep **External-File Protection** ON
   - Approve file edits when prompted
   - ✅ Maximum security
   - ⚠️ Manual approval needed for each file edit
   - **Recommendation:** If security is priority

#### Step 4: Configure Guardrails (Optional but Recommended)

**Setting:** `Guardrails` or "Safeguards"

**Description:** Configure allow lists to specify which tools can execute automatically

**Action:** Add allowed commands/tools:
- `pnpm sprint:resume`
- `pnpm sprint:complete`
- `pnpm install`
- `pnpm add`
- `pnpm remove`
- File write operations in worktree directories

**Use case:** Provides security by explicitly defining permitted operations

#### Step 5: Enable AutoFixErrors (Optional)

**Setting:** `AutoFixErrors` or "Automatically fix errors"

**Description:** Automatically resolves linter errors and warnings

**Action:** Enable if desired

**Use case:** Allows agents to fix linting issues automatically

### Configuration Summary

```
Cursor Settings → Agents → Auto-Run:

✅ Auto-Run Mode: "Run Everything (Unsandboxed)"
✅ External-File Protection: OFF (for worktrees) ⚠️ CRITICAL
✅ File-Deletion Protection: ON (safety)
✅ Dotfile Protection: ON (safety)
✅ Browser Protection: OFF (or ON if you want to block browser tools)

Cursor Settings → Agents → Applying Changes:

✅ Auto-Fix Lints: ON (optional but recommended)
✅ Auto-Accept on Commit: ON (optional)
✅ Jump to Next Diff on Accept: ON (optional)
```

### What Agents Can Do Autonomously

Once configured, agents have **COMPLETE AUTONOMY** in their worktree directory:

✅ **Edit any files** in their worktree  
✅ **Create new files** anywhere in their worktree  
✅ **Delete files** if needed for refactoring  
✅ **Modify configuration files** (package.json, tsconfig.json, etc.)  
✅ **Run any commands** needed to complete tasks  
✅ **Install dependencies** with `pnpm add/remove`  
✅ **Make git commits** directly (no approval needed)  
✅ **Create subagents** for parallel tasks within their workstream  

### Security Boundaries

Agents are **restricted** from:

❌ **Pushing to GitHub** (orchestrator handles integration)  
❌ **Merging branches** (orchestrator handles merging)  
❌ **Creating pull requests** (orchestrator handles PRs)  
❌ **Working on tasks outside their workstream**  
❌ **Switching to develop or other branches**  

**Key Point:** Agents can only work in their isolated worktree. The main repository is protected.

### Verification

**Test the configuration:**

1. Start a new Agent session
2. Run: `/workstream-agent frontend`
3. Try editing a file in the worktree
4. Should work **without prompts** ✅

**If still prompting:**
- Check **External-File Protection** setting
- Verify worktrees are added to workspace (if using Option 2)
- Restart Cursor or start a new Agent session

### Troubleshooting

#### File Edits Still Prompting?

**Root Cause:** Worktrees are in a sibling directory (`../worktrees/`), which Cursor considers "outside the workspace". The **External-File Protection** setting blocks edits there.

**Solutions:**

1. **Disable External-File Protection** (Quick Fix)
   - Go to `Cursor Settings` → `Agents` → `Auto-Run`
   - Turn OFF **External-File Protection**
   - Restart Agent session

2. **Add Worktrees to Workspace** (Better Solution)
   - In Cursor: `File` → `Add Folder to Workspace...`
   - Add the `worktrees/` directory
   - Restart Agent session

3. **Accept Prompts** (Safest)
   - Keep **External-File Protection** ON
   - Approve file edits when prompted

**After applying a solution:**
1. Restart Agent session (close and start new)
2. Test file edit in worktree
3. Should work without prompts (Option 1 or 2) or with prompts (Option 3)

### Notes

- **AutoRun and AutoApplyEdits are separate settings** - both must be enabled
- These settings apply globally to all Agent sessions
- Guardrails provide an extra security layer by allowing only specific commands
- After enabling, restart Cursor or start a new Agent session
- File writes in worktree directories should now work without prompts

---

## 7. Execution Modes

### Standard Mode (Default)

**Activated by:** `/orchestrator` (no parameters)

**Use when:** You want to simulate real GitHub PR workflow

**Workflow:**
1. Push branches to GitHub
2. Create PRs
3. Wait for GitHub Actions validation
4. Wait for user to merge PRs
5. Sync from remote after merge

**Best for:**
- Testing full CI/CD pipeline
- Demonstrating PR workflow
- Production-like development

**Cleanup:**
- Removes worktrees and branches
- Preserves merge history in develop

### Local CI Mode

**Activated by:** `/orchestrator --local-ci` or `/orchestrator local-ci`

**Use when:** You want to test integration locally without GitHub

**Workflow:**
1. Merge branches locally into develop
2. Test manually on develop branch
3. Cleanup resets develop to starting commit

**Best for:**
- Quick local testing
- Development
- Demos without GitHub setup

**Key difference:**
- Cleanup resets develop to starting commit (removes all merge history)
- **Result:** Repository returns to exact state before sprint started

**Cleanup:**
- Resets develop to starting commit
- Removes worktrees and branches
- Perfect for testing and demos

### Mode Selection

**The mode is stored in `.claude/sprint-config.json`** and persists for the entire sprint session. All subsequent commands will automatically use the correct mode.

**You don't need to pass `--local-ci` again** after initial setup - the mode is remembered.

---

## 8. Commands Reference

### Orchestrator Commands

#### `pnpm sprint:analyze <sprint-file>`

**Purpose:** Analyze sprint backlog for workstream opportunities

**Example:**
```bash
pnpm sprint:analyze .claude/backlog/sprint-1-hello-api.md
```

**Output:** Workstream analysis with dependencies and recommendations

---

#### `pnpm sprint:create-workstreams <sprint-file>`

**Purpose:** Create all workstreams and worktrees based on analysis

**Example:**
```bash
pnpm sprint:create-workstreams .claude/backlog/sprint-1-hello-api.md
```

**Creates:**
- Worktrees: `../worktrees/<workstream-1>/`, `../worktrees/<workstream-2>/`, etc.
- Branches: `feature/<workstream-1>-workstream`, `feature/<workstream-2>-workstream`, etc.
- Updates sprint file with workstream status

---

#### `pnpm sprint:orchestrate [sprint-file]`

**Purpose:** Show overall sprint status and next actions

**Example:**
```bash
pnpm sprint:orchestrate .claude/backlog/sprint-1-hello-api.md
```

**Shows:**
- Active workstreams and their status
- Completed story points
- Next actions needed
- Which workstreams are ready to push

---

#### `pnpm sprint:status`

**Purpose:** Show detailed status of all workstreams

**Example:**
```bash
pnpm sprint:status
```

**Output:** List of all workstreams with their current git status

---

#### `pnpm sprint:push <workstream-name>`

**Purpose:** Push workstream to GitHub and create PR (Standard Mode)

**Example:**
```bash
pnpm sprint:push frontend
```

**Executes:**
1. Pushes workstream branch to GitHub
2. Outputs PR creation URL
3. Provides PR title and description
4. Updates sprint file: status = "pushed"

---

#### `pnpm sprint:merge-local <workstream-name>`

**Purpose:** Merge workstream locally into develop (Local CI Mode)

**Example:**
```bash
pnpm sprint:merge-local frontend
```

**Executes:**
1. Switches to develop branch
2. Merges the workstream branch into develop
3. Runs quality gates on the merged code
4. Updates sprint config to mark workstream as merged

---

#### `pnpm sprint:sync <workstream-name>`

**Purpose:** Sync one workstream with updated develop

**Example:**
```bash
pnpm sprint:sync backend
```

**Executes:**
1. Fetches latest develop
2. Merges develop into workstream branch
3. Resolves conflicts if any
4. Updates sprint file with sync status

---

#### `pnpm sprint:sync-all`

**Purpose:** Sync all workstreams with updated develop

**Example:**
```bash
pnpm sprint:sync-all
```

**Executes:**
1. Updates local develop
2. Syncs all workstreams with develop
3. Resolves conflicts if any
4. Updates sprint file with sync status

---

#### `pnpm sprint:cleanup [sprint-file]`

**Purpose:** Clean up worktrees and branches after sprint completion

**Example:**
```bash
pnpm sprint:cleanup .claude/backlog/sprint-1-hello-api.md
```

**Executes:**
1. Confirms all workstreams are complete
2. Syncs develop
3. Removes all worktrees
4. Deletes local workstream branches
5. Updates sprint file with completion status

**Mode-dependent:**
- **Standard Mode:** Removes worktrees and branches, preserves merge history
- **Local CI Mode:** Resets develop to starting commit, removes worktrees and branches

---

### Workstream Agent Commands

#### `pnpm sprint:resume <workstream-name>`

**Purpose:** Resume work on a specific workstream

**Example:**
```bash
pnpm sprint:resume frontend
```

**Executes:**
1. Loads workstream configuration from `.claude/sprint-config.json`
2. Navigates to worktree directory automatically
3. Displays assigned tasks
4. Shows autonomy instructions
5. Updates workstream status to "in_progress"

**Note:** Cursor may show a permission dialog the first time - this is expected. Once approved, the command will execute and navigate to the worktree. After this initial approval, all subsequent commands in the worktree should work without prompts.

---

#### `pnpm sprint:complete <workstream-name>`

**Purpose:** Complete a workstream

**Example:**
```bash
pnpm sprint:complete frontend
```

**Executes:**
1. Updates sprint file: workstream status = "ready_for_integration"
2. Shows completion summary
3. Reports to orchestrator

---

### Command Usage Pattern

**Orchestrator Session:**
```bash
# Initialize
/orchestrator                    # or /orchestrator --local-ci

# Setup
pnpm sprint:analyze <sprint-file>
pnpm sprint:create-workstreams <sprint-file>

# Monitor
pnpm sprint:orchestrate <sprint-file>
pnpm sprint:status

# Integrate
pnpm sprint:push <workstream>     # Standard mode
# or
pnpm sprint:merge-local <workstream>  # Local CI mode

# Sync
pnpm sprint:sync-all

# Cleanup
pnpm sprint:cleanup <sprint-file>
```

**Agent Session:**
```bash
# Initialize
/workstream-agent <workstream-name>

# Work autonomously (no commands needed - just work!)
# Edit files, run commands, commit - all without prompts

# Complete
pnpm sprint:complete <workstream-name>
```

---

## 9. Benefits & Value

### Development Speed

✅ **True Parallelization**
- Multiple agents work simultaneously
- No waiting for sequential PR merges
- Faster sprint completion

✅ **No Context Switching**
- `cd` instead of `git checkout`
- All workstreams accessible simultaneously
- No lost context

✅ **Parallel Dev Servers**
- Each workstream runs on different port
- Test multiple features simultaneously
- Faster feedback loops

### Quality & Safety

✅ **Isolation**
- Worktrees provide perfect development isolation
- No interference between parallel workstreams
- Safe parallel development

✅ **Quality Gates**
- Automatic quality checks before integration
- Tests, linting, type checking, build
- Catch issues early

✅ **Conflict Detection**
- Automatic conflict detection during sync
- Early conflict resolution
- Reduced merge conflicts

### Team Productivity

✅ **Clear Responsibilities**
- Orchestrator coordinates big picture
- Agents focus on implementation
- Clear boundaries and roles

✅ **Autonomous Agents**
- Agents work without permission prompts
- Faster development cycles
- Reduced friction

✅ **One PR Per Workstream**
- Not one PR per task
- Cleaner PR history
- Easier code review

### Scalability

✅ **Works with Any Sprint**
- Framework is sprint-agnostic
- Works with any number of workstreams
- Scales to large teams

✅ **Flexible Execution**
- Standard mode for production
- Local CI mode for testing
- Adapts to different needs

---

## 10. System Validation

### Evaluation Summary

**Status:** ✅ **PRODUCTION READY**  
**Test Success Rate:** **100%** (12/12 tests passed)  
**Date:** October 28, 2024

The Sprint Workstreams system has been thoroughly tested and validated. Both orchestrator and workstream agent commands work flawlessly with perfect integration.

### Test Results

| Component | Tests | Passed | Success Rate |
|-----------|-------|--------|--------------|
| Orchestrator Commands | 6 | 6 | 100% |
| Workstream Agent Commands | 5 | 5 | 100% |
| Cleanup Script | 1 | 1 | 100% |
| **Total** | **12** | **12** | **100%** |

### Key Validation Points

✅ **Orchestrator Command (`/orchestrator`):**
- Correctly handles all states (no config, analyzed, workstreams created)
- Proper status tracking and monitoring
- Clear guidance and error handling
- Perfect integration with workstream agents

✅ **Workstream Agent Command (`/workstream-agent`):**
- Proper worktree initialization and management
- Correct task assignment and status updates
- Complete environment isolation
- Seamless integration with orchestrator

✅ **Cleanup System:**
- Reliable environment reset capabilities
- Complete worktree and branch cleanup
- Perfect for testing and maintenance

### Production Readiness

- All core functionality works perfectly
- Error handling is robust and user-friendly
- System is fully documented and maintainable
- Cleanup and testing workflows are reliable
- Integration between components is seamless

**Complete evaluation details:** [System Evaluation Documentation](./EVALUATION.md)

---

## 11. Demo Sprint

### Sprint 1: Hello API (Simplified Demo)

**Duration:** ~45 minutes  
**Goal:** Demonstrate parallel workstream development with minimal complexity  
**Target Velocity:** 3 story points

### Sprint Objectives

1. Create frontend workstream for a simple button component
2. Create backend workstream for a simple API endpoint
3. Create testing workstream for integration testing
4. Demonstrate parallel workstream development workflow

### Tasks

#### [TASK-101] Create Hello Button Component

**Agent:** ui-engineer  
**Priority:** P0  
**Effort:** 1 story point  
**Workstream:** frontend

**Description:**
Create a simple button component that calls the `/api/hello` endpoint and displays the response message.

**Acceptance Criteria:**
- [ ] Button component created
- [ ] Button calls `/api/hello` on click
- [ ] Displays API response message
- [ ] TypeScript typed
- [ ] Basic unit test (button renders, click handler works)

**Dependencies:**
- **Depends on:** Sprint 0 foundation
- **Blocks:** TASK-103 (Integration testing)

---

#### [TASK-102] Create Hello API Endpoint

**Agent:** backend-engineer  
**Priority:** P0  
**Effort:** 1 story point  
**Workstream:** backend

**Description:**
Create a simple API endpoint that returns a hello message.

**Acceptance Criteria:**
- [ ] API route created (`/api/hello`)
- [ ] Returns JSON: `{ message: "Hello from API!" }`
- [ ] Basic error handling
- [ ] TypeScript typed
- [ ] Basic unit test (endpoint returns correct response)

**Dependencies:**
- **Depends on:** Sprint 0 foundation
- **Blocks:** TASK-103 (Integration testing)

---

#### [TASK-103] Create Integration Test

**Agent:** qa-engineer  
**Priority:** P0  
**Effort:** 1 story point  
**Workstream:** testing

**Description:**
Create a single integration test that verifies the complete flow: button click → API call → message display.

**Acceptance Criteria:**
- [ ] E2E test created (Playwright)
- [ ] Test clicks button
- [ ] Test verifies API call is made
- [ ] Test verifies message is displayed
- [ ] Test passes

**Dependencies:**
- **Depends on:** TASK-101, TASK-102
- **Blocks:** Sprint completion

---

### Workstreams

#### Workstream 1: Frontend (frontend)
- **Agent:** ui-engineer
- **Tasks:** TASK-101
- **Dependencies:** None (parallel safe)
- **File conflicts:** None detected
- **Worktree:** ../worktrees/frontend/

#### Workstream 2: Backend (backend)
- **Agent:** backend-engineer
- **Tasks:** TASK-102
- **Dependencies:** None (parallel safe)
- **File conflicts:** None detected
- **Worktree:** ../worktrees/backend/

#### Workstream 3: Testing (testing)
- **Agent:** qa-engineer
- **Tasks:** TASK-103
- **Dependencies:** TASK-101, TASK-102
- **File conflicts:** None detected
- **Worktree:** ../worktrees/testing/

---

### Sprint Summary

**Total Story Points:** 3  
**Critical Path:** TASK-101, TASK-102 → TASK-103  
**Risk Areas:** Minimal (simple feature for demo purposes)

**Sprint Success Criteria:**
- [ ] Hello button component functional
- [ ] Hello API endpoint responding correctly
- [ ] Integration test passing
- [ ] All workstreams completed
- [ ] Zero blocking issues

**Note:** This is a simplified sprint designed for fast demo purposes (~45 minutes). It demonstrates the parallel workstream workflow system without complex feature requirements.

---

## 12. Live Demo Script

### Pre-Demo Setup (5 minutes)

**Before the presentation:**

1. **Configure Cursor Settings** (if not done)
   - Set Auto-Run Mode: "Run Everything (Unsandboxed)"
   - Set External-File Protection: OFF
   - Verify settings are saved

2. **Clean State**
   ```bash
   # Ensure clean state
   git checkout develop
   git pull origin develop
   pnpm sprint:cleanup-all  # If previous sprint exists
   ```

3. **Prepare Sprint File**
   - Verify `.claude/backlog/sprint-1-hello-api.md` exists
   - Review tasks and workstreams

---

### Part 1: Setup & Analysis (5 minutes)

**Goal:** Show how to initialize a sprint and create workstreams

#### Step 1: Initialize Orchestrator

```bash
# Show current state
pnpm sprint:orchestrate .claude/backlog/sprint-1-hello-api.md
```

**Expected Output:**
- No sprint configuration detected
- Guidance to run `pnpm sprint:analyze`

**Explain:**
- Orchestrator coordinates the big picture
- Monitors all workstreams
- Handles integration

#### Step 2: Analyze Sprint

```bash
# Analyze sprint for workstreams
pnpm sprint:analyze .claude/backlog/sprint-1-hello-api.md
```

**Expected Output:**
- 3 workstreams identified
- Dependencies detected (testing depends on frontend + backend)
- Worktree paths generated
- Sprint configuration created

**Explain:**
- System analyzes sprint backlog
- Groups tasks into workstreams
- Detects dependencies
- Creates configuration

#### Step 3: Create Workstreams

```bash
# Create worktrees for all workstreams
pnpm sprint:create-workstreams .claude/backlog/sprint-1-hello-api.md
```

**Expected Output:**
- 3 worktrees created
- 3 feature branches created
- Workstreams ready to start

**Show:**
```bash
# Verify worktrees created
ls ../worktrees/
# Should show: frontend/ backend/ testing/

# Verify branches
git branch -a | grep workstream
# Should show: feature/frontend-workstream, etc.
```

**Explain:**
- Worktrees are complete codebase copies
- Each workstream has its own branch
- Isolated development environments

#### Step 4: Check Status

```bash
# Show orchestrator status
pnpm sprint:orchestrate .claude/backlog/sprint-1-hello-api.md
```

**Expected Output:**
- 3 workstreams shown as "ready_to_start"
- Next actions: start agents

**Explain:**
- Orchestrator monitors all workstreams
- Shows status and next actions
- Ready for parallel work

---

### Part 2: Parallel Work (10 minutes)

**Goal:** Show agents working in parallel without interference

#### Step 1: Start Frontend Agent

**Open new terminal/chat instance:**

```bash
# Initialize frontend agent
/workstream-agent frontend
```

**Expected Output:**
- Navigates to `../worktrees/frontend/`
- Shows assigned task: TASK-101
- Shows autonomy instructions
- Status updated to "in_progress"

**Explain:**
- Agent has complete autonomy in worktree
- No permission prompts (if configured correctly)
- Can edit files, run commands, commit freely

**Start dev server:**
```bash
# In frontend worktree
pnpm dev --port 3001
```

**Show:**
- Dev server running on port 3001
- Can work on button component

#### Step 2: Start Backend Agent

**Open new terminal/chat instance:**

```bash
# Initialize backend agent
/workstream-agent backend
```

**Expected Output:**
- Navigates to `../worktrees/backend/`
- Shows assigned task: TASK-102
- Shows autonomy instructions
- Status updated to "in_progress"

**Start dev server:**
```bash
# In backend worktree
pnpm dev --port 3002
```

**Show:**
- Dev server running on port 3002
- Can work on API endpoint
- **Running in parallel with frontend!**

#### Step 3: Demonstrate Autonomy

**In frontend worktree:**
- Edit a file (e.g., create button component)
- **Show:** No permission prompts ✅
- Run commands (test, lint)
- **Show:** Works autonomously ✅

**In backend worktree:**
- Edit a file (e.g., create API route)
- **Show:** No permission prompts ✅
- Run commands (test, lint)
- **Show:** Works autonomously ✅

**Explain:**
- Both agents working simultaneously
- No interference between workstreams
- Parallel dev servers on different ports
- Complete isolation

#### Step 4: Show Testing Agent (Waiting)

**Open new terminal/chat instance:**

```bash
# Initialize testing agent
/workstream-agent testing
```

**Expected Output:**
- Navigates to `../worktrees/testing/`
- Shows assigned task: TASK-103
- Shows dependencies: TASK-101, TASK-102

**Explain:**
- Testing agent knows it depends on frontend + backend
- Can wait or prepare test structure
- Will work after dependencies complete

#### Step 5: Complete Workstreams

**In frontend worktree:**
```bash
# After implementing button component
pnpm test run
pnpm type-check
pnpm lint
pnpm build

# Commit
git add .
git commit -m "feat: implement hello button component (TASK-101)"

# Complete workstream
pnpm sprint:complete frontend
```

**In backend worktree:**
```bash
# After implementing API endpoint
pnpm test run
pnpm type-check
pnpm lint
pnpm build

# Commit
git add .
git commit -m "feat: implement hello API endpoint (TASK-102)"

# Complete workstream
pnpm sprint:complete backend
```

**Show:**
- Both workstreams completed
- Quality gates passed
- Ready for integration

---

### Part 3: Integration (10 minutes)

**Goal:** Show sequential integration workflow

#### Step 1: Orchestrator Status

**Back to orchestrator session:**

```bash
# Check status
pnpm sprint:orchestrate .claude/backlog/sprint-1-hello-api.md
```

**Expected Output:**
- Frontend: "ready_for_integration"
- Backend: "ready_for_integration"
- Testing: "in_progress" (waiting for dependencies)
- Next actions: push frontend and backend

**Explain:**
- Orchestrator sees completed workstreams
- Knows which to integrate first
- Sequential integration (one at a time)

#### Step 2: Push Frontend (Standard Mode)

**If using Standard Mode:**

```bash
# Push frontend workstream
pnpm sprint:push frontend
```

**Expected Output:**
- Branch pushed to GitHub
- PR creation URL provided
- PR title and description provided
- Status updated to "pushed"

**Show:**
- PR URL in browser
- Create PR (or show pre-filled PR)
- **Explain:** Wait for GitHub Actions and merge

**If using Local CI Mode:**

```bash
# Merge frontend locally
pnpm sprint:merge-local frontend
```

**Expected Output:**
- Switched to develop
- Merged frontend branch
- Quality gates run
- Status updated to "merged"

**Show:**
- Develop branch now has frontend changes
- Can test manually

#### Step 3: Sync All Workstreams

**After frontend is merged:**

```bash
# Update develop
git checkout develop
git pull origin develop  # If using Standard Mode

# Sync all workstreams
pnpm sprint:sync-all
```

**Expected Output:**
- Updated develop with frontend changes
- Synced backend workstream
- Synced testing workstream
- All workstreams up-to-date

**Explain:**
- Other workstreams now have frontend changes
- Testing can start working
- Backend can continue with updated code

#### Step 4: Push Backend

**Repeat for backend:**

```bash
# Push backend workstream
pnpm sprint:push backend  # Standard Mode
# or
pnpm sprint:merge-local backend  # Local CI Mode
```

**Then sync again:**

```bash
pnpm sprint:sync-all
```

**Explain:**
- Sequential integration
- One workstream at a time
- Sync after each merge

#### Step 5: Complete Testing

**Back to testing agent:**

```bash
# In testing worktree
# Now has frontend + backend changes
# Can implement integration test

pnpm test:e2e  # Run E2E test

# Commit
git add .
git commit -m "feat: implement hello integration test (TASK-103)"

# Complete
pnpm sprint:complete testing
```

#### Step 6: Final Integration

**Back to orchestrator:**

```bash
# Push testing workstream
pnpm sprint:push testing  # Standard Mode
# or
pnpm sprint:merge-local testing  # Local CI Mode

# Final sync
pnpm sprint:sync-all
```

**Show:**
- All workstreams integrated
- Sprint complete
- All tests passing

---

### Part 4: Cleanup (2 minutes)

**Goal:** Show cleanup process

#### Step 1: Verify Completion

```bash
# Check final status
pnpm sprint:orchestrate .claude/backlog/sprint-1-hello-api.md
```

**Expected Output:**
- All workstreams merged
- Sprint complete
- Ready for cleanup

#### Step 2: Cleanup

```bash
# Clean up worktrees and branches
pnpm sprint:cleanup .claude/backlog/sprint-1-hello-api.md
```

**Expected Output:**
- Removed all worktrees
- Deleted local branches
- Cleaned up configuration
- (Local CI Mode: Reset develop to starting commit)

**Show:**
```bash
# Verify cleanup
ls ../worktrees/  # Should be empty or not exist
git branch -a | grep workstream  # Should show no workstream branches
```

**Explain:**
- Clean state restored
- Ready for next sprint
- All workstreams successfully integrated

---

### Demo Summary Points

**Key Takeaways:**

1. **True Parallelization**
   - Multiple agents work simultaneously
   - No interference between workstreams
   - Parallel dev servers

2. **Agent Autonomy**
   - No permission prompts (if configured)
   - Complete freedom in worktree
   - Fast development cycles

3. **Orchestrated Integration**
   - Sequential integration
   - Automatic conflict resolution
   - Quality gates before merge

4. **Complete Isolation**
   - Worktrees provide perfect isolation
   - Safe parallel development
   - No merge conflicts during development

5. **Scalable Framework**
   - Works with any sprint
   - Any number of workstreams
   - Production-ready system

---

## Appendix: Quick Reference

### Essential Commands

**Orchestrator:**
```bash
/orchestrator                    # Initialize orchestrator
pnpm sprint:analyze <file>       # Analyze sprint
pnpm sprint:create-workstreams <file>  # Create worktrees
pnpm sprint:orchestrate <file>   # Check status
pnpm sprint:push <name>          # Push workstream (Standard)
pnpm sprint:merge-local <name>   # Merge locally (Local CI)
pnpm sprint:sync-all            # Sync all workstreams
pnpm sprint:cleanup <file>      # Cleanup
```

**Agent:**
```bash
/workstream-agent <name>         # Initialize agent
pnpm sprint:complete <name>      # Complete workstream
```

### Cursor Settings Checklist

- [ ] Auto-Run Mode: "Run Everything (Unsandboxed)"
- [ ] External-File Protection: OFF (for worktrees)
- [ ] File-Deletion Protection: ON
- [ ] Dotfile Protection: ON
- [ ] Browser Protection: OFF (or ON)

### Workstream Status Values

- `ready_to_start` - Workstream created, no agent started
- `pending` - Agent started work, tasks in progress
- `in_progress` - Agent actively working
- `completed` - Agent finished all tasks
- `ready_for_integration` - Ready for quality gates and push
- `ready_for_push` - Ready to push to GitHub
- `merged` - PR merged to develop
- `merged_and_cleaned` - Workstream merged and cleaned up

---

## Questions & Answers

### Q: Why use worktrees instead of branches?

**A:** Worktrees allow multiple complete codebase copies, enabling:
- Parallel dev servers on different ports
- No context switching (`cd` instead of `git checkout`)
- True isolation between workstreams
- All workstreams accessible simultaneously

### Q: What if workstreams have file conflicts?

**A:** The system detects conflicts during sync. When syncing after a merge:
- Conflicts are identified automatically
- Script pauses and shows conflict files
- Resolve conflicts in workstream worktree
- Re-run sync to continue

### Q: Can I use this with existing sprints?

**A:** Yes! The framework is sprint-agnostic. Just:
- Create sprint backlog file
- Run `pnpm sprint:analyze`
- Create workstreams
- Start working

### Q: What about security with External-File Protection OFF?

**A:** Security is maintained through:
- Worktree isolation (separate directories)
- Agent restrictions (cannot push, merge, create PRs)
- Main repo protection (worktrees are separate)
- Optional: Add worktrees to workspace instead of disabling protection

### Q: How do I handle merge conflicts?

**A:** Conflicts are handled during sync:
1. Script detects conflicts
2. Pauses and shows conflict files
3. Manually resolve in workstream worktree
4. Commit resolution
5. Re-run sync to continue

---

**End of Presentation Document**

