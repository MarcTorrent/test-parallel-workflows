# Sprint Orchestration Framework
## Parallel Development with Git Worktrees

**Presentation Document**  
*15-minute overview - Essential concepts and commands*

---

## Slide 1: The Problem

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

## Slide 2: The Solution

### Sprint Workstreams with Git Worktrees

✅ **True Parallelization**
- Multiple workstreams work simultaneously in isolated worktrees
- Each workstream has its own complete codebase
- Parallel dev servers on different ports
- **Result:** Faster sprint completion, no waiting for sequential PR merges

✅ **Instant Context Switching**
- `cd` instead of `git checkout`
- No lost context between workstreams
- All workstreams accessible simultaneously
- **Result:** No context switching overhead, faster development cycles

✅ **Orchestrated Integration**
- One PR per workstream (not one per task)
- Sequential integration with automatic conflict resolution
- Quality gates before integration
- **Result:** Cleaner PR history, easier code review, early conflict detection

✅ **Complete Isolation**
- Worktrees provide perfect development isolation
- No interference between parallel workstreams
- Safe parallel development
- **Result:** Reduced merge conflicts, early conflict resolution

---

## Slide 3: Core Concepts

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

## Slide 4: Architecture Overview

### Directory Structure

```
<your-workspace>/
├── test-parallel-workflows/     (main repository)
│   ├── .claude/
│   │   ├── sprint-config.json   (workstream tracking)
│   │   └── backlog/
│   │       └── sprint-1-*.md    (sprint definition)
│   └── src/                     (application code)
│
└── worktrees/                   (sibling directory, created automatically)
    ├── frontend/                 (worktree for frontend workstream)
    ├── backend/                  (worktree for backend workstream)
    └── testing/                  (worktree for testing workstream)
```

**Important Notes:**
- Worktrees are created in a `worktrees/` directory **sibling** to the main repository
- Each worktree is a complete codebase copy with its own branch
- All paths use relative paths (`../worktrees/<name>`) for portability

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

---

## Slide 5: Workflow Overview

### Phase 1: Sprint Setup (Orchestrator)
1. **Analyze sprint:** `/orchestrator` → analyzes sprint backlog
2. **Create workstreams:** Orchestrator creates worktrees and branches
3. **Monitor:** Orchestrator tracks all workstreams

### Phase 2: Parallel Work (Agents)
1. **Start agent:** `/workstream-agent <name>` → navigates to worktree
2. **Work autonomously:** Edit files, run commands, commit (no prompts!)
3. **Complete workstream:** Agent marks workstream as complete

### Phase 3: Sequential Integration (Orchestrator)
1. **Push/merge:** Orchestrator integrates workstreams one at a time
2. **Sync:** After each merge, sync all other workstreams
3. **Repeat:** Continue until all workstreams integrated

### Phase 4: Cleanup (Orchestrator)
1. **Verify completion:** All workstreams merged
2. **Cleanup:** Remove worktrees and branches

**Key Point:** Agents work in parallel, orchestrator handles sequential integration.

---

## Slide 6: Agent Autonomy Setup

### The Challenge
Without proper configuration, Cursor agents will prompt for **every file edit**, breaking the autonomous parallel workflow.

### The Solution: Cursor Configuration

**Critical Settings:**

1. **Auto-Run Mode:** `"Run Everything (Unsandboxed)"`
   - Enables automatic execution of terminal commands
   - Enables automatic file edits

2. **External-File Protection:** ⚠️ **OFF** (CRITICAL)
   - Worktrees are in `../worktrees/` (sibling directory)
   - Cursor treats this as "external" to the workspace
   - Must be OFF for worktree edits to work automatically

3. **Alternative:** Add worktrees to workspace
   - `File` → `Add Folder to Workspace...`
   - Add the `worktrees/` directory
   - More secure than disabling protection

### What Agents Can Do Autonomously

✅ **Edit any files** in their worktree  
✅ **Create new files** anywhere in their worktree  
✅ **Run any commands** needed to complete tasks  
✅ **Make git commits** directly (no approval needed)  

❌ **Cannot push to GitHub** (orchestrator handles integration)  
❌ **Cannot merge branches** (orchestrator handles merging)  
❌ **Cannot create pull requests** (orchestrator handles PRs)  

**Key Point:** Agents have complete autonomy in their worktree, but cannot affect the main repository.

---

## Slide 7: Commands Reference - Slash Commands ⭐

### The Framework Works with Slash Commands

**These are the PRIMARY way to use the framework.** Scripts are secondary.

### Orchestrator Slash Command

#### `/orchestrator [--local-ci]`

**Purpose:** Initialize orchestrator mode and coordinate sprint

**Usage:**
```
/orchestrator                    # Standard mode (GitHub PRs)
/orchestrator --local-ci         # Local CI mode (local merges)
```

**What it does:**
- Sets up orchestrator context
- Shows current sprint status
- Provides guidance on next steps
- Remembers mode for entire sprint session

**When to use:**
- Start of sprint: Initialize orchestrator
- During sprint: Check status and get guidance
- Anytime: Get orchestrator context

### Workstream Agent Slash Command

#### `/workstream-agent <workstream-name>`

**Purpose:** Initialize workstream agent mode for specific workstream

**Usage:**
```
/workstream-agent frontend
/workstream-agent backend
/workstream-agent testing
```

**What it does:**
- Loads workstream configuration
- Navigates to worktree directory automatically
- Displays assigned tasks
- Shows autonomy instructions
- Updates workstream status to "in_progress"

**When to use:**
- Start working on a workstream
- Resume work on a workstream
- Switch between workstreams

**Key Point:** Slash commands provide context-aware guidance and handle navigation automatically.

---

## Slide 8: Commands Reference - Scripts (Secondary)

### Scripts Support the Slash Commands

**Note:** Scripts are used internally by slash commands. You can also run them directly, but slash commands are preferred.

### Orchestrator Scripts

**Setup:**
- `pnpm sprint:analyze <sprint-file>` - Analyze sprint for workstreams
- `pnpm sprint:create-workstreams <sprint-file>` - Create worktrees and branches

**Monitoring:**
- `pnpm sprint:orchestrate [sprint-file]` - Show sprint status and next actions
- `pnpm sprint:status` - Show detailed workstream status

**Integration:**
- `pnpm sprint:push <workstream-name>` - Push to GitHub (Standard Mode)
- `pnpm sprint:merge-local <workstream-name>` - Merge locally (Local CI Mode)
- `pnpm sprint:sync-all` - Sync all workstreams with updated develop

**Cleanup:**
- `pnpm sprint:cleanup [sprint-file]` - Remove worktrees and branches

### Agent Scripts

- `pnpm sprint:complete <workstream-name>` - Mark workstream as complete

**Key Point:** Use slash commands (`/orchestrator`, `/workstream-agent`) as the primary interface. Scripts are available for advanced use cases.

---

## Slide 9: Key Benefits Summary

### Development Speed
✅ **True Parallelization** - Multiple agents work simultaneously  
✅ **No Context Switching** - `cd` instead of `git checkout`  
✅ **Parallel Dev Servers** - Test multiple features simultaneously  

### Quality & Safety
✅ **Isolation** - Worktrees provide perfect development isolation  
✅ **Quality Gates** - Automatic quality checks before integration  
✅ **Conflict Detection** - Early conflict resolution during sync  

### Team Productivity
✅ **Clear Responsibilities** - Orchestrator coordinates, agents implement  
✅ **Autonomous Agents** - Agents work without permission prompts  
✅ **One PR Per Workstream** - Cleaner PR history, easier code review  

### Scalability
✅ **Works with Any Sprint** - Framework is sprint-agnostic  
✅ **Any Number of Workstreams** - Scales to large teams  
✅ **Flexible Execution** - Standard mode or Local CI mode  

---

## Slide 10: Getting Started

### Quick Start

1. **Initialize Orchestrator:**
   ```
   /orchestrator
   ```

2. **Analyze Sprint:**
   ```
   pnpm sprint:analyze .claude/backlog/sprint-1-hello-api.md
   ```

3. **Create Workstreams:**
   ```
   pnpm sprint:create-workstreams .claude/backlog/sprint-1-hello-api.md
   ```

4. **Start Agents:**
   ```
   /workstream-agent frontend
   /workstream-agent backend
   ```

5. **Monitor Progress:**
   ```
   /orchestrator
   ```

6. **Integrate Workstreams:**
   ```
   pnpm sprint:push frontend
   pnpm sprint:sync-all
   ```

### Essential Configuration

**Cursor Settings → Agents → Auto-Run:**
- ✅ Auto-Run Mode: "Run Everything (Unsandboxed)"
- ✅ External-File Protection: OFF (for worktrees) ⚠️ CRITICAL
- ✅ File-Deletion Protection: ON (safety)
- ✅ Dotfile Protection: ON (safety)

### Documentation

- **Complete Documentation:** `docs/FRAMEWORK_COMPLETE.md`
- **Architecture Details:** `docs/ARCHITECTURE.md`
- **Development Workflow:** `.claude/workflow/development-workflow.md`

---

**End of Presentation**

