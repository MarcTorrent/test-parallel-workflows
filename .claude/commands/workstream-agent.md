---
description: Initialize a workstream agent to work on sprint tasks in an isolated worktree. Usage: /workstream-agent <workstream-name>
autoExecute: true
---

# Workstream Agent Initializer

**🚀 AUTO-EXECUTE MODE**: When this command is invoked with `/workstream-agent <workstream-name>`, you MUST immediately do the following **WITHOUT ASKING FOR PERMISSION**:

1. **Read config file**: Read `.claude/sprint-config.json` to get workstream info (no permission needed - file read)
2. **Find workstream**: Locate the workstream named `{arg1}` in the config
3. **Navigate**: Change to the worktree directory using `cd` (no permission needed for cd)
4. **Display info**: Show the workstream details, tasks, and autonomy instructions

**DO NOT ASK FOR PERMISSION** - file reads and directory changes don't require permission prompts.

## Step 1: Load Workstream Info (File Read - No Permission Needed)

**Read the sprint config file directly** (this is a file read operation, no terminal command needed):

Read: `.claude/sprint-config.json`

Find the workstream with `name: "{arg1}"` and extract:
- `tasks`: Array of task IDs assigned to this workstream
- `worktree`: Path to the worktree directory (relative to project root)
- `status`: Current status of the workstream

## Step 2: Navigate to Worktree (cd - No Permission Needed)

**Change directory immediately** (cd doesn't require permission):

```bash
cd ../worktrees/{arg1}
```

Or use the absolute path from the config. The worktree path from config is relative to the project root.

**Verify location** (these are read operations, no permission needed):
- Check current directory
- Verify you're on branch `feature/{arg1}-workstream`

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

**After reading the config and navigating above**, you should now:
- Have read the workstream info from `.claude/sprint-config.json`
- Be in the worktree directory (`../worktrees/{arg1}/`)
- Know your assigned tasks from the config
- Understand your full autonomy in this worktree

**Start implementing the first task** in your workstream task list. Remember: you have complete autonomy - no permission needed for file edits, commits, or running commands in your worktree.

**Optional**: If you want to see the formatted output that `pnpm sprint:resume` would show, you can run it, but it's not required - you already have all the info from the config file.






