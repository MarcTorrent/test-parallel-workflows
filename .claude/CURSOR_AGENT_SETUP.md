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

### 2. Enable AutoApplyEdits ⚠️ CRITICAL
- **Setting**: `AutoApplyEdits` or "Automatically apply edits" or "Auto-apply edits"
- **Description**: Automatically applies edits without manual confirmation
- **Action**: **Enable this toggle** (this is separate from AutoRun!)
- **Location**: Same settings page as AutoRun, but it's a different toggle
- **Use case**: Allows file writes (like `package.json`, source files, etc.) without permission prompts
- **Note**: If file edits still prompt, double-check this setting is enabled

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

## Troubleshooting

### File Edits Still Prompting?

If terminal commands work (AutoRun is working) but file edits still ask for permission:

1. **Verify AutoApplyEdits is enabled**:
   - Go back to Cursor Settings → Features → Agent → Tools
   - Look for "AutoApplyEdits" or "Automatically apply edits"
   - Make sure the toggle is **ON** (not just AutoRun)

2. **Check Guardrails configuration**:
   - If Guardrails are configured, make sure file write operations are allowed
   - Or temporarily disable Guardrails to test if that's the issue

3. **Restart Agent session**:
   - Close the current Agent chat
   - Start a new Agent session
   - Settings changes may require a new session

4. **Check for file-specific restrictions**:
   - Some files (like `.env`, config files) might have additional protections
   - Check if the file is in a protected directory

## Notes

- **AutoRun and AutoApplyEdits are separate settings** - both must be enabled
- These settings apply globally to all Agent sessions
- Guardrails provide an extra security layer by allowing only specific commands
- After enabling, restart Cursor or start a new Agent session
- File writes in worktree directories should now work without prompts

## Reference

- Cursor Documentation: https://docs.cursor.com/en/agent/tools
- Agent Overview: https://docs.cursor.com/en/agent/overview

