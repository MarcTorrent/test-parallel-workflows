# Cursor Agent Auto-Execution Setup

To enable workstream agents to work autonomously without permission prompts, configure Cursor's Agent settings.

## Access Agent Settings

1. Open Cursor Settings: `Cmd/Ctrl + Shift + J` or `Cmd/Ctrl + Shift + P` → "Cursor Settings"
2. Navigate to: **Features** → **Agent** → **Tools** (or **Agent** → **Advanced Options**)

## Required Settings

### 1. Configure Auto-Run Mode ⚠️ CRITICAL
- **Setting**: `Auto-Run Mode` (dropdown)
- **Location**: `Cursor Settings` → `Agents` → `Auto-Run` section
- **Current Setting**: "Run Everything (Unsandboxed)"
- **Description**: Controls how Agent runs tools like command execution, MCP, and file writes
- **Action**: Set to **"Run Everything (Unsandboxed)"** (this should enable both terminal commands AND file edits)
- **Use case**: Allows `pnpm sprint:resume` and file edits to run without prompts
- **Note**: This is the main setting that controls automatic execution

### 2. Protection Settings (Important for Worktrees!)
- **Location**: `Cursor Settings` → `Agents` → `Auto-Run` section
- **Settings to check**:
  - **File-Deletion Protection**: ON (prevents auto-deletion - keep ON for safety)
  - **Dotfile Protection**: ON (prevents modifying .gitignore, etc. - keep ON for safety)
  - **External-File Protection**: ⚠️ **CRITICAL FOR WORKTREES**
    - **ON**: Blocks file edits in worktrees (they're outside workspace)
    - **OFF**: Allows file edits in worktrees automatically
    - **Recommendation**: Turn OFF if you want worktree edits to work automatically
  - **Browser Protection**: OFF (allows browser tools - adjust as needed)
- **Note**: Since worktrees are in `../worktrees/` (sibling directory), Cursor treats them as "external" to the workspace

### 3. Configure Guardrails (Optional but Recommended)
- **Setting**: `Guardrails` or "Safeguards"
- **Description**: Configure allow lists to specify which tools can execute automatically
- **Action**: Add allowed commands/tools:
  - `pnpm sprint:resume`
  - `pnpm sprint:complete`
  - `pnpm install`
  - `pnpm add`
  - `pnpm remove`
  - File write operations in worktree directories
- **Use case**: Provides security by explicitly defining permitted operations

### 4. Enable AutoFixErrors (Optional)
- **Setting**: `AutoFixErrors` or "Automatically fix errors"
- **Description**: Automatically resolves linter errors and warnings
- **Action**: Enable if desired
- **Use case**: Allows agents to fix linting issues automatically

## Configuration Summary

```
Cursor Settings → Agents → Auto-Run:

✅ Auto-Run Mode: "Run Everything (Unsandboxed)"
✅ File-Deletion Protection: ON (safety)
✅ Dotfile Protection: ON (safety)
✅ External-File Protection: ON (safety)
✅ Browser Protection: OFF (or ON if you want to block browser tools)

Cursor Settings → Agents → Applying Changes:

✅ Auto-Fix Lints: ON (optional but recommended)
✅ Auto-Accept on Commit: ON (optional)
✅ Jump to Next Diff on Accept: ON (optional)
```

## Troubleshooting

### File Edits Still Prompting? (Worktree Issue)

**Root Cause**: Worktrees are in a sibling directory (`../worktrees/`), which Cursor considers "outside the workspace". The **External-File Protection** setting blocks edits there.

**Solutions** (choose one):

#### Option 1: Disable External-File Protection (Quick Fix)
- Go to `Cursor Settings` → `Agents` → `Auto-Run`
- Turn OFF **External-File Protection**
- **Pros**: Worktree file edits will work automatically
- **Cons**: Less safe - allows edits outside workspace in general
- **Recommendation**: Only if you trust the worktree workflow

#### Option 2: Add Worktrees to Workspace (Better Solution)
- In Cursor: `File` → `Add Folder to Workspace...`
- Add the `worktrees/` directory (or individual worktree folders)
- **Pros**: Worktrees become part of workspace, External-File Protection won't block them
- **Cons**: Slightly more complex setup
- **Recommendation**: Best long-term solution

#### Option 3: Accept Prompts (Safest)
- Keep **External-File Protection** ON
- Approve file edits when prompted
- **Pros**: Maximum security
- **Cons**: Manual approval needed for each file edit
- **Recommendation**: If security is priority

**After applying a solution**:
1. Restart Agent session (close and start new)
2. Test file edit in worktree
3. Should work without prompts (Option 1 or 2) or with prompts (Option 3)

## Notes

- **AutoRun and AutoApplyEdits are separate settings** - both must be enabled
- These settings apply globally to all Agent sessions
- Guardrails provide an extra security layer by allowing only specific commands
- After enabling, restart Cursor or start a new Agent session
- File writes in worktree directories should now work without prompts

## Reference

- Cursor Documentation: https://docs.cursor.com/en/agent/tools
- Agent Overview: https://docs.cursor.com/en/agent/overview

