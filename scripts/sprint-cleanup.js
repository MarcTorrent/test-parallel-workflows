const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sprintFile = process.argv[2];
if (!sprintFile) {
  console.error('Usage: pnpm sprint:cleanup [sprint-file]');
  process.exit(1);
}

const sprintConfigPath = path.join(process.cwd(), '.claude/sprint-config.json');
if (!fs.existsSync(sprintConfigPath)) {
  console.error('❌ Sprint configuration not found. Please run `pnpm sprint:analyze <sprint-file>` first.');
  process.exit(1);
}

const sprintConfig = JSON.parse(fs.readFileSync(sprintConfigPath, 'utf8'));

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧹 CLEANING UP SPRINT WORKSTREAMS');
if (sprintConfig.localCiMode) {
  console.log('🎭 LOCAL CI MODE: Will reset develop to starting commit');
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

try {
  // Check if all workstreams are completed
  const incompleteWorkstreams = sprintConfig.workstreams.filter(ws => 
    ws.status !== 'completed' && ws.status !== 'merged'
  );
  if (incompleteWorkstreams.length > 0) {
    console.log('⚠️ Warning: Some workstreams are not completed:');
    incompleteWorkstreams.forEach(ws => {
      console.log(`   - ${ws.name}: ${ws.status}`);
    });
    console.log('\nProceeding with cleanup anyway...');
  }

  // In local CI mode, reset develop to starting commit first
  if (sprintConfig.localCiMode && sprintConfig.startingCommit) {
    console.log('\n🔄 Resetting develop to starting commit...');
    try {
      // Ensure we're on develop
      execSync('git checkout develop', { stdio: 'inherit' });
      
      // Reset to starting commit (hard reset removes all merge commits)
      execSync(`git reset --hard ${sprintConfig.startingCommit}`, { stdio: 'inherit' });
      console.log(`✅ Develop branch reset to starting commit: ${sprintConfig.startingCommit.substring(0, 7)}`);
    } catch (error) {
      console.error('⚠️ Failed to reset develop branch:', error.message);
      console.error('   You may need to manually reset develop to the starting commit.');
    }
  }

  // Remove worktrees
  console.log('\n🗑️ Removing worktrees...');
  sprintConfig.workstreams.forEach(ws => {
    const worktreePath = path.resolve(process.cwd(), ws.worktree);

    if (fs.existsSync(worktreePath)) {
      try {
        console.log(`   Removing worktree: ${ws.name}`);
        execSync(`git worktree remove ${worktreePath}`, { stdio: 'inherit' });
        console.log(`   ✅ Removed: ${ws.name}`);
      } catch (error) {
        console.log(`   ⚠️ Failed to remove worktree ${ws.name}: ${error.message}`);
      }
    }
  });

  // Delete local branches
  console.log('\n🌿 Deleting local branches...');
  sprintConfig.workstreams.forEach(ws => {
    const branchName = `feature/${ws.name}-workstream`;
    try {
      execSync(`git branch -D ${branchName}`, { stdio: 'pipe' });
      console.log(`   ✅ Deleted local branch: ${branchName}`);
    } catch (error) {
      console.log(`   ⚠️ Branch not found or already deleted: ${branchName}`);
    }
  });

  // Ask about remote branches
  console.log('\n🌐 Remote branches:');
  sprintConfig.workstreams.forEach(ws => {
    const branchName = `feature/${ws.name}-workstream`;
    console.log(`   - origin/${branchName}`);
  });

  console.log('\n💡 To delete remote branches, run:');
  sprintConfig.workstreams.forEach(ws => {
    const branchName = `feature/${ws.name}-workstream`;
    console.log(`   git push origin --delete ${branchName}`);
  });

  // Clean up sprint configuration
  console.log('\n📝 Cleaning up sprint configuration...');
  if (fs.existsSync(sprintConfigPath)) {
    fs.unlinkSync(sprintConfigPath);
    console.log('   ✅ Removed sprint configuration');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ SPRINT CLEANUP COMPLETE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('\n📋 CLEANUP SUMMARY:');
  console.log(`   - Worktrees removed: ${sprintConfig.workstreams.length}`);
  console.log(`   - Local branches deleted: ${sprintConfig.workstreams.length}`);
  console.log('   - Sprint configuration cleaned');

} catch (error) {
  console.error('❌ Failed to cleanup sprint:', error.message);
  process.exit(1);
}






