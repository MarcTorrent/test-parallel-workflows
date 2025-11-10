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

### 2. Enable Auto-Apply Edits ⚠️ CRITICAL
- **Setting Names** (may vary by Cursor version):
  - "Automatically apply edits"
  - "Auto-apply edits"
  - "Edit and Reapply" (tool setting)
  - "AutoApplyEdits" (if visible)
- **Description**: Automatically applies edits without manual confirmation
- **Action**: **Enable this toggle** (this is separate from AutoRun!)
- **Location Options**:
  1. `Cursor Settings` → `Features` → `Agent` → `Tools` (Advanced Options)
  2. `Cursor Settings` → `Features` → `Agent` → Look for edit-related toggles
  3. In the Agent chat interface, check for tool settings/gear icon
- **Use case**: Allows file writes (like `package.json`, source files, etc.) without permission prompts
- **Note**: If you can't find this setting, it may be:
  - Named differently in your Cursor version
  - Part of Guardrails configuration
  - Not available in your Cursor version (may need update)

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

1. **Find the Auto-Apply Setting**:
   - Go to `Cursor Settings` → `Features` → `Agent`
   - Look through all sub-sections: `Tools`, `Advanced Options`, etc.
   - Search for keywords: "apply", "edit", "auto", "reapply"
   - Check if there's a tool list where "Edit and Reapply" can be enabled
   - **Alternative**: Check if it's in Guardrails as an allowed tool

2. **Check Guardrails/Safeguards Configuration**:
   - If Guardrails are configured, look for "Edit" or "File" tools
   - Add "Edit and Reapply" or "File Write" to the allowed tools list
   - Or temporarily disable Guardrails to test if that's the issue

3. **Check Cursor Version**:
   - Some features may only be in newer versions
   - Check for Cursor updates: `Help` → `Check for Updates`
   - The setting might be in a Beta section

4. **Restart Agent session**:
   - Close the current Agent chat
   - Start a new Agent session
   - Settings changes may require a new session

5. **Check for file-specific restrictions**:
   - Some files (like `.env`, config files) might have additional protections
   - Check if the file is in a protected directory

6. **If setting doesn't exist**:
   - This may be a limitation of your Cursor version
   - File edits may always require approval for security
   - Consider this expected behavior and approve when prompted

## Notes

- **AutoRun and AutoApplyEdits are separate settings** - both must be enabled
- These settings apply globally to all Agent sessions
- Guardrails provide an extra security layer by allowing only specific commands
- After enabling, restart Cursor or start a new Agent session
- File writes in worktree directories should now work without prompts

## Reference

- Cursor Documentation: https://docs.cursor.com/en/agent/tools
- Agent Overview: https://docs.cursor.com/en/agent/overview

