#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// ANSI colors for better terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${question}${colors.reset}`, (answer) => {
      resolve(answer);
    });
  });
}

function runCommand(command, cwd = process.cwd(), description = '') {
  return new Promise((resolve, reject) => {
    if (description) {
      log(`\n🚀 ${description}`, colors.yellow);
    }
    log(`💻 Running: ${command}`, colors.dim);
    log(`📁 In directory: ${cwd}`, colors.dim);
    
    const child = spawn(command, { 
      shell: true, 
      stdio: 'inherit', 
      cwd 
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${description || 'Command'} completed successfully`, colors.green);
        resolve(code);
      } else {
        log(`❌ ${description || 'Command'} failed with code ${code}`, colors.red);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      log(`❌ ${description || 'Command'} failed: ${error.message}`, colors.red);
      reject(error);
    });
  });
}

async function checkStrapiRunning() {
  return new Promise((resolve) => {
    exec('curl -s http://localhost:1337/admin > /dev/null 2>&1', (error) => {
      resolve(!error);
    });
  });
}

async function startStrapi() {
  const isRunning = await checkStrapiRunning();
  if (isRunning) {
    log('✅ Strapi is already running', colors.green);
    return;
  }
  
  log('🔄 Starting Strapi...', colors.yellow);
  const backendPath = path.join(process.cwd(), 'backend');
  
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'develop'], { 
      cwd: backendPath,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true
    });
    
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('Strapi started successfully')) {
        child.unref();
        log('✅ Strapi started successfully', colors.green);
        resolve();
      }
    });
    
    child.stderr.on('data', (data) => {
      output += data.toString();
      if (output.includes('already used')) {
        log('✅ Strapi is already running', colors.green);
        resolve();
      }
    });
    
    setTimeout(() => {
      child.unref();
      log('⏰ Strapi startup timeout - assuming it\'s running', colors.yellow);
      resolve();
    }, 10000);
  });
}

async function exportPosts() {
  const backendPath = path.join(process.cwd(), 'backend');
  await runCommand('npm run export-posts', backendPath, 'Exporting posts from Strapi to markdown');
}

async function manageTags() {
  const backendPath = path.join(process.cwd(), 'backend');
  await runCommand('npm run manage-tags', backendPath, 'Managing tags and removing duplicates');
}

async function importPosts() {
  const backendPath = path.join(process.cwd(), 'backend');
  await runCommand('npm run import-posts', backendPath, 'Importing posts from markdown to Strapi');
}

async function buildFrontend() {
  const frontendPath = path.join(process.cwd(), 'frontend');
  await runCommand('npm run build', frontendPath, 'Building frontend with optimized images');
}

async function checkGitStatus() {
  return new Promise((resolve) => {
    exec('git status --porcelain', (error, stdout) => {
      if (error) {
        resolve({ hasChanges: false, changes: [] });
      } else {
        const changes = stdout.trim().split('\n').filter(line => line.trim());
        resolve({ hasChanges: changes.length > 0, changes });
      }
    });
  });
}

async function generateCommitMessage() {
  // Check what files changed to create a smart commit message
  return new Promise((resolve) => {
    exec('git diff --name-only HEAD', (error, stdout) => {
      if (error) {
        resolve('rebuild');
        return;
      }
      
      const changes = stdout.trim().split('\n').filter(line => line.trim());
      const hasOut = changes.some(file => file.includes('frontend/out/'));
      const hasPosts = changes.some(file => file.includes('posts/'));
      const hasMarkdown = changes.some(file => file.endsWith('.md'));
      
      if (hasOut && hasPosts) {
        resolve('rebuild: updated posts and generated static site');
      } else if (hasOut) {
        resolve('rebuild: regenerated static site');
      } else if (hasMarkdown || hasPosts) {
        resolve('rebuild: updated blog content');
      } else {
        resolve('rebuild: updated website content');
      }
    });
  });
}

async function gitAddCommitPush() {
  log('\n📋 Checking git status...', colors.yellow);
  const { hasChanges, changes } = await checkGitStatus();
  
  if (!hasChanges) {
    log('✅ No changes to commit', colors.green);
    return;
  }
  
  log(`📝 Found ${changes.length} changed files`, colors.blue);
  changes.slice(0, 5).forEach(change => {
    log(`   ${change}`, colors.dim);
  });
  if (changes.length > 5) {
    log(`   ... and ${changes.length - 5} more files`, colors.dim);
  }
  
  const commitMessage = await generateCommitMessage();
  log(`💬 Generated commit message: "${commitMessage}"`, colors.cyan);
  
  try {
    await runCommand('git add .', process.cwd(), 'Adding all changes to git');
    await runCommand(`git commit -m "${commitMessage}"`, process.cwd(), 'Committing changes');
    await runCommand('git push', process.cwd(), 'Pushing to remote repository');
    log('🚀 Successfully deployed to git!', colors.green);
  } catch (error) {
    log(`❌ Git operations failed: ${error.message}`, colors.red);
    throw error;
  }
}

async function runFullDeployWorkflow() {
  log('\n🚀 Running full deploy workflow: export → manage tags → import → build → commit → push', colors.bright);
  
  try {
    await startStrapi();
    await exportPosts();
    await manageTags();
    await importPosts();
    await buildFrontend();
    await gitAddCommitPush();
    log('\n🎉 Full deployment completed successfully!', colors.green);
    log('🌐 Your changes are now live!', colors.cyan);
  } catch (error) {
    log(`\n❌ Deployment failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

async function runDefaultWorkflow() {
  log('\n🔄 Running default workflow: manage tags → import → build', colors.bright);
  
  try {
    await startStrapi();
    await manageTags();
    await importPosts();
    await buildFrontend();
    log('\n🎉 Default workflow completed successfully!', colors.green);
  } catch (error) {
    log(`\n❌ Workflow failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

async function showMenu() {
  console.clear();
  log('╭───────────────────────────────────────────────────────╮', colors.cyan);
  log('│                🏗️  Website Management                 │', colors.cyan);
  log('├───────────────────────────────────────────────────────┤', colors.cyan);
  log('│  1. 🚀 Run Default Workflow (tags→import→build)', colors.white);
  log('│  2. 🌐 Full Deploy (workflow + commit + push)', colors.yellow);
  log('│  3. 📤 Export posts (Strapi → markdown)', colors.white);
  log('│  4. 🏷️  Manage tags (normalize & remove duplicates)', colors.white);
  log('│  5. 📥 Import posts (markdown → Strapi)', colors.white);
  log('│  6. 🔨 Build frontend (Next.js static export)', colors.white);
  log('│  7. 📋 Git add + commit + push', colors.white);
  log('│  8. ⚡ Start/Check Strapi server', colors.white);
  log('│  9. 📊 Show project status', colors.white);
  log('│ 10. ❌ Exit', colors.white);
  log('╰───────────────────────────────────────────────────────╯', colors.cyan);
  
  const choice = await prompt('\nEnter your choice (1-10): ');
  return choice.trim();
}

async function showStatus() {
  log('\n📊 Project Status:', colors.bright);
  
  // Check Strapi
  const strapiRunning = await checkStrapiRunning();
  log(`🖥️  Strapi: ${strapiRunning ? '✅ Running' : '❌ Not running'}`, strapiRunning ? colors.green : colors.red);
  
  // Count posts
  const postsPath = path.join(process.cwd(), 'posts');
  if (fs.existsSync(postsPath)) {
    const posts = fs.readdirSync(postsPath).filter(f => f.endsWith('.md'));
    log(`📝 Markdown posts: ${posts.length} files`, colors.blue);
  }
  
  // Check frontend build
  const frontendBuildPath = path.join(process.cwd(), 'frontend', 'out');
  const frontendBuilt = fs.existsSync(frontendBuildPath);
  log(`🔨 Frontend build: ${frontendBuilt ? '✅ Built' : '❌ Not built'}`, frontendBuilt ? colors.green : colors.red);
  
  log('\n📍 Directories:', colors.bright);
  log(`   Root: ${process.cwd()}`, colors.dim);
  log(`   Backend: ${path.join(process.cwd(), 'backend')}`, colors.dim);
  log(`   Frontend: ${path.join(process.cwd(), 'frontend')}`, colors.dim);
  log(`   Posts: ${path.join(process.cwd(), 'posts')}`, colors.dim);
}

async function interactiveMode() {
  while (true) {
    try {
      const choice = await showMenu();
      
      switch (choice) {
        case '1':
          await runDefaultWorkflow();
          break;
        case '2':
          await runFullDeployWorkflow();
          break;
        case '3':
          await startStrapi();
          await exportPosts();
          break;
        case '4':
          await startStrapi();
          await manageTags();
          break;
        case '5':
          await startStrapi();
          await importPosts();
          break;
        case '6':
          await buildFrontend();
          break;
        case '7':
          await gitAddCommitPush();
          break;
        case '8':
          await startStrapi();
          break;
        case '9':
          await showStatus();
          break;
        case '10':
          log('\n👋 Goodbye!', colors.green);
          process.exit(0);
        default:
          log('❌ Invalid choice. Please enter 1-10.', colors.red);
      }
      
      if (choice !== '9') {
        const continueChoice = await prompt('\n⏸️  Press Enter to continue or "q" to quit: ');
        if (continueChoice.toLowerCase() === 'q') {
          break;
        }
      }
    } catch (error) {
      log(`\n❌ Error: ${error.message}`, colors.red);
      const continueChoice = await prompt('\n⏸️  Press Enter to continue or "q" to quit: ');
      if (continueChoice.toLowerCase() === 'q') {
        break;
      }
    }
  }
  
  rl.close();
}

function showHelp() {
  log('🏗️  Website Management Tool', colors.bright);
  log('═══════════════════════════', colors.bright);
  log('');
  log('Usage:', colors.cyan);
  log('  ./manage.js [options]', colors.white);
  log('');
  log('Options:', colors.cyan);
  log('  -i, --interactive    Interactive mode with menu', colors.white);
  log('  -d, --deploy         Full deploy workflow (export→tags→import→build→commit→push)', colors.yellow);
  log('  -h, --help           Show this help message', colors.white);
  log('');
  log('Default behavior (no flags):', colors.cyan);
  log('  Runs interactive mode', colors.white);
  log('');
  log('Examples:', colors.cyan);
  log('  ./manage.js -i       # Interactive menu', colors.dim);
  log('  ./manage.js -d       # Full deploy workflow', colors.dim);
  log('  ./manage.js          # Interactive mode (default)', colors.dim);
}

async function main() {
  const args = process.argv.slice(2);
  const isInteractive = args.includes('-i') || args.includes('--interactive');
  const isDeploy = args.includes('-d') || args.includes('--deploy');
  const isHelp = args.includes('-h') || args.includes('--help');
  
  if (isHelp) {
    showHelp();
    return;
  }
  
  log('🏗️  Website Management Tool', colors.bright);
  log('═══════════════════════════', colors.bright);
  
  if (isInteractive) {
    await interactiveMode();
  } else if (isDeploy) {
    // Run full deploy workflow
    await runFullDeployWorkflow();
    rl.close();
  } else if (args.length === 0) {
    await interactiveMode();
  } else {
    // Run default workflow
    await runDefaultWorkflow();
    rl.close();
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  log('\n\n👋 Goodbye!', colors.green);
  rl.close();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  log(`\n❌ Uncaught error: ${error.message}`, colors.red);
  rl.close();
  process.exit(1);
});

main().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  rl.close();
  process.exit(1);
});