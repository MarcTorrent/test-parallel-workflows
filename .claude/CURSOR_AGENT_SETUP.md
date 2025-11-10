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

### 2. Protection Settings (Review)
- **Location**: `Cursor Settings` → `Agents` → `Auto-Run` section
- **Settings to check**:
  - **File-Deletion Protection**: ON (prevents auto-deletion - keep ON for safety)
  - **Dotfile Protection**: ON (prevents modifying .gitignore, etc. - keep ON for safety)
  - **External-File Protection**: ON (prevents modifying files outside workspace - keep ON for safety)
  - **Browser Protection**: OFF (allows browser tools - adjust as needed)
- **Note**: These protection settings should NOT block regular file edits within the workspace when "Run Everything" is enabled

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

### File Edits Still Prompting?

If "Run Everything (Unsandboxed)" is enabled but file edits still ask for permission:

1. **Verify Auto-Run Mode Setting**:
   - Go to `Cursor Settings` → `Agents` → `Auto-Run`
   - Confirm `Auto-Run Mode` is set to **"Run Everything (Unsandboxed)"**
   - If it's set to "Ask" or "Sandboxed", change it to "Run Everything"

2. **Check Protection Settings**:
   - The protection toggles (File-Deletion, Dotfile, External-File) should NOT block regular file edits
   - However, if you're editing dotfiles (like `.gitignore`), `Dotfile Protection` being ON will block it
   - If editing files outside workspace, `External-File Protection` will block it
   - **For worktree files**: These should work fine with "Run Everything" enabled

3. **Restart Agent Session**:
   - Close the current Agent chat completely
   - Start a new Agent session
   - Settings changes require a new session to take effect

4. **Check File Location**:
   - Make sure you're editing files **within the workspace** (not outside)
   - Worktree directories should be considered part of the workspace
   - Files outside the workspace will be blocked by `External-File Protection`

5. **If Still Prompting**:
   - This may be a Cursor bug or limitation
   - Try restarting Cursor completely
   - Check for Cursor updates: `Help` → `Check for Updates`
   - As a workaround, approve file edits when prompted (AutoRun for terminal commands is working)

## Notes

- **AutoRun and AutoApplyEdits are separate settings** - both must be enabled
- These settings apply globally to all Agent sessions
- Guardrails provide an extra security layer by allowing only specific commands
- After enabling, restart Cursor or start a new Agent session
- File writes in worktree directories should now work without prompts

## Reference

- Cursor Documentation: https://docs.cursor.com/en/agent/tools
- Agent Overview: https://docs.cursor.com/en/agent/overview

