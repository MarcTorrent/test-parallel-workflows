# Cursor Agent Auto-Execution Setup

To enable workstream agents to work autonomously without permission prompts, configure Cursor's Agent settings.

## Access Agent Settings

1. Open Cursor Settings: `Cmd/Ctrl + Shift + J` or `Cmd/Ctrl + Shift + P` → "Cursor Settings"
2. Navigate to: **Features** → **Agent** → **Tools** (or **Agent** → **Advanced Options**)

## Required Settings

### 1. Enable AutoRun
- **Setting**: `AutoRun` or "Automatically execute terminal commands"
- **Description**: Automatically executes terminal commands and accepts edits
- **Action**: Enable this toggle
- **Use case**: Allows `pnpm sprint:resume` and other commands to run without prompts

### 2. Enable AutoApplyEdits
- **Setting**: `AutoApplyEdits` or "Automatically apply edits"
- **Description**: Automatically applies edits without manual confirmation
- **Action**: Enable this toggle
- **Use case**: Allows file writes (like `package.json`) without permission prompts

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
Cursor Settings → Features → Agent → Tools:

✅ AutoRun: ON
✅ AutoApplyEdits: ON
✅ Guardrails: Configure allow list for sprint commands
✅ AutoFixErrors: ON (optional)
```

## Notes

- These settings apply globally to all Agent sessions
- Guardrails provide an extra security layer by allowing only specific commands
- After enabling, restart Cursor or start a new Agent session
- File writes in worktree directories should now work without prompts

## Reference

- Cursor Documentation: https://docs.cursor.com/en/agent/tools
- Agent Overview: https://docs.cursor.com/en/agent/overview

