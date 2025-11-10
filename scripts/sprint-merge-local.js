#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workstreamName = process.argv[2];
if (!workstreamName) {
  console.error('Usage: pnpm sprint:merge-local <workstream-name>');
  process.exit(1);
}

const sprintConfigPath = path.join(process.cwd(), '.claude/sprint-config.json');
if (!fs.existsSync(sprintConfigPath)) {
  console.error('❌ Sprint configuration not found. Please run `pnpm sprint:analyze <sprint-file>` first.');
  process.exit(1);
}

const sprintConfig = JSON.parse(fs.readFileSync(sprintConfigPath, 'utf8'));

if (!sprintConfig.localCiMode) {
  console.error('❌ Local CI mode not enabled. Use --local-ci flag when creating workstreams.');
  process.exit(1);
}

const workstream = sprintConfig.workstreams.find(ws => ws.name === workstreamName);

if (!workstream) {
  console.error(`❌ Workstream '${workstreamName}' not found in sprint configuration.`);
  process.exit(1);
}

const branchName = `feature/${workstream.name}-workstream`;
const worktreePath = path.resolve(process.cwd(), workstream.worktree);

if (!fs.existsSync(worktreePath)) {
  console.error(`❌ Worktree directory not found for '${workstreamName}' at ${worktreePath}.`);
  process.exit(1);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`🔄 MERGING WORKSTREAM LOCALLY: ${workstream.name}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

try {
  // Save original directory
  const originalDir = process.cwd();

  // Check if workstream has uncommitted changes
  process.chdir(worktreePath);
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (status) {
    console.error('⚠️ Warning: Uncommitted changes detected in workstream:');
    console.error(status);
    console.error('Please commit changes before merging.');
    process.exit(1);
  }

  // Return to main project directory
  process.chdir(originalDir);

  // Ensure we're on develop branch
  console.log('\n📥 Switching to develop branch...');
  execSync('git checkout develop', { stdio: 'inherit' });

  // Check if branch exists
  try {
    execSync(`git show-ref --verify --quiet refs/heads/${branchName}`, { stdio: 'pipe' });
  } catch (error) {
    console.error(`❌ Branch '${branchName}' not found.`);
    process.exit(1);
  }

  // Merge the workstream branch into develop
  console.log(`\n🔀 Merging ${branchName} into develop...`);
  try {
    execSync(`git merge ${branchName} -m "chore: merge ${workstream.name} workstream (local CI)"`, { stdio: 'inherit' });
    console.log(`✅ Successfully merged ${branchName} into develop`);
  } catch (error) {
    console.error('❌ Merge failed. This may indicate merge conflicts.');
    console.error('Please resolve conflicts manually and try again.');
    process.exit(1);
  }

  // Run quality gates on merged code
  console.log('\n🧪 Running quality gates on merged code...');
  try {
    console.log('   Running tests...');
    execSync('pnpm test run', { stdio: 'inherit' });
    console.log('   ✅ Tests passed');
  } catch (error) {
    console.error('❌ Tests failed. Please fix issues before proceeding.');
    process.exit(1);
  }

  try {
    console.log('   Running type check...');
    execSync('pnpm type-check', { stdio: 'inherit' });
    console.log('   ✅ Type check passed');
  } catch (error) {
    console.error('❌ Type check failed. Please fix issues before proceeding.');
    process.exit(1);
  }

  try {
    console.log('   Running linter...');
    execSync('pnpm lint', { stdio: 'inherit' });
    console.log('   ✅ Linter passed');
  } catch (error) {
    console.error('❌ Linter failed. Please fix issues before proceeding.');
    process.exit(1);
  }

  try {
    console.log('   Running build...');
    execSync('pnpm build', { stdio: 'inherit' });
    console.log('   ✅ Build passed');
  } catch (error) {
    console.error('❌ Build failed. Please fix issues before proceeding.');
    process.exit(1);
  }

  // Update workstream status
  workstream.status = 'merged';
  workstream.mergedAt = new Date().toISOString();
  fs.writeFileSync(sprintConfigPath, JSON.stringify(sprintConfig, null, 2));

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ WORKSTREAM MERGED LOCALLY: ${workstream.name}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log(`\nBranch: ${branchName}`);
  console.log(`Merged into: develop`);

  console.log('\n📝 NEXT STEPS:');
  console.log('1. Test the merged changes manually:');
  console.log('   pnpm dev');
  console.log('2. When satisfied, proceed to merge next workstream');
  console.log('3. When all workstreams are merged, run cleanup:');
  console.log(`   pnpm sprint:cleanup .claude/backlog/${sprintConfig.sprint}.md`);

} catch (error) {
  console.error('❌ Failed to merge workstream locally:', error.message);
  process.exit(1);
}

