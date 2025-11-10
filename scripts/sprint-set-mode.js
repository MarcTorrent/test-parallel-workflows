#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// This script is called by the orchestrator command to set the mode
// Usage: node sprint-set-mode.js [--local-ci|local-ci]

const args = process.argv.slice(2);
const localCiMode = args.includes('--local-ci') || args.includes('local-ci');

const sprintConfigPath = path.join(process.cwd(), '.claude/sprint-config.json');

// If config doesn't exist yet, create a minimal one
let sprintConfig = {};
if (fs.existsSync(sprintConfigPath)) {
  sprintConfig = JSON.parse(fs.readFileSync(sprintConfigPath, 'utf8'));
}

// Set the mode
sprintConfig.localCiMode = localCiMode;

// Ensure .claude directory exists
if (!fs.existsSync('.claude')) {
  fs.mkdirSync('.claude', { recursive: true });
}

// Save config
fs.writeFileSync(sprintConfigPath, JSON.stringify(sprintConfig, null, 2));

if (localCiMode) {
  console.log('🎭 Local CI mode enabled for this sprint session');
  console.log('   All operations will use local merging and cleanup will reset develop');
} else {
  console.log('🌐 Standard mode (GitHub PR workflow) enabled for this sprint session');
  console.log('   All operations will use GitHub PR workflow');
}

