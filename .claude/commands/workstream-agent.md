---
description: Initialize a workstream agent to work on sprint tasks in an isolated worktree. Usage: /workstream-agent <workstream-name>
autoExecute: true
---

# Workstream Agent Initializer

**🚀 AUTO-EXECUTE MODE**: When this command is invoked with `/workstream-agent <workstream-name>`, you MUST immediately execute the following commands **WITHOUT ASKING FOR PERMISSION OR CONFIRMATION**:

1. **Execute**: `pnpm sprint:resume {arg1}` (run immediately, no confirmation needed)
2. **Navigate**: `cd ../worktrees/{arg1}` (change directory immediately)
3. **Verify**: Check location with `pwd` and `git branch`

**DO NOT ASK FOR PERMISSION** - these are initialization commands that must run automatically.

## Step 1: Load Workstream Info

**EXECUTE IMMEDIATELY** (no permission needed):

```bash
pnpm sprint:resume {arg1}
```

This command will:
- Load workstream configuration
- Navigate to the worktree directory
- Display assigned tasks
- Show autonomy instructions

## Step 2: Navigate to Worktree

**EXECUTE IMMEDIATELY** (no permission needed):

```bash
cd ../worktrees/{arg1}
```

**Note**: The `sprint:resume` script already changes directory, but verify you're in the correct location:
```bash
pwd  # Should show: <project-root>/../worktrees/{arg1}
git branch  # Should show: feature/{arg1}-workstream
```

**Note**: Worktrees are created in a sibling `worktrees/` directory relative to the project root. The exact path depends on where you cloned the repository.

## Step 3: Understand Your Role

You are a **WORKSTREAM AGENT** for this Sprint. You are NOT the main orchestrator.

**Your Mission**: Complete all tasks assigned to the `{arg1}` workstream.

## 🚀 FULL AUTONOMY IN YOUR WORKTREE

**CRITICAL**: You have **COMPLETE AUTONOMY** in your worktree directory. You do NOT need to ask for permission to:

- ✅ **Edit any files** in your worktree
- ✅ **Create new files** anywhere in your worktree
- ✅ **Delete files** if needed for refactoring
- ✅ **Modify configuration files** (package.json, tsconfig.json, etc.)
- ✅ **Run any commands** needed to complete your tasks
- ✅ **Install dependencies** with pnpm add/remove
- ✅ **Make git commits** directly (no approval needed)
- ✅ **Create subagents** for parallel tasks within your workstream

**Your worktree is YOUR isolated workspace** - work freely and autonomously!

**The ONLY restrictions are:**
- ❌ DON'T push to GitHub (orchestrator handles integration)
- ❌ DON'T merge branches (orchestrator handles merging)
- ❌ DON'T work on tasks outside your workstream
- ❌ DON'T switch to develop or other branches
- ❌ DON'T create pull requests

## Your Workflow

1. **Check your tasks**: Look at the sprint:resume output for your assigned TASK-XXX items
2. **Implement each task sequentially**: Follow TDD workflow (Red → Green → Refactor)
   - **Work autonomously** - no need to ask permission for file edits
   - **Create subagents** if you need parallel work within your workstream
3. **Run quality gates** after each task:
   ```bash
   pnpm test run        # Unit tests - FAST, run first
   pnpm type-check      # TypeScript checking
   pnpm lint            # Linting
   pnpm build           # Production build - SLOW, run last
   ```
4. **Commit after each completed task** (commit directly, no approval needed)
5. **When ALL tasks complete**: Run `pnpm sprint:complete {arg1}`

## Important Boundaries

**DO:**
- ✅ Work ONLY on tasks assigned to the `{arg1}` workstream
- ✅ Commit after each completed task with proper format
- ✅ Run all quality gates before each commit
- ✅ Follow TDD: write tests first, then implementation
- ✅ **Work autonomously** - edit/create/delete files as needed
- ✅ **Create subagents** for parallel tasks if beneficial

**DON'T:**
- ❌ Push to GitHub (orchestrator handles integration)
- ❌ Merge branches (orchestrator handles merging)
- ❌ Work on tasks outside your workstream
- ❌ Switch to develop or other branches
- ❌ Create pull requests
- ❌ **Ask for permission** to edit files in your worktree (you have full autonomy)

## Getting Started

**After executing the initialization commands above**, you should now:
- Be in the worktree directory (`../worktrees/{arg1}/`)
- Have seen the assigned tasks from the sprint:resume output
- Understand your full autonomy in this worktree

**Start implementing the first task** in your workstream task list. Remember: you have complete autonomy - no permission needed for file edits, commits, or running commands.





