#!/usr/bin/env node
// Check a multi-project workspace's README.md and .project-context/ against the project-context rules.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { basename, dirname, join, normalize, relative, resolve } from 'node:path';

const ROOT_LIMIT = 8192;
const FILE_LIMIT = 5120;
const LINK = /\]\(([^)#\s]+\.md)(?:#[^)]*)?\)/g;

// Return [git dir, common dir] when path is the top of a git checkout, else null.
function gitDirs(path) {
  if (!existsSync(join(path, '.git'))) return null;
  try {
    const out = execFileSync('git', ['-C', path, 'rev-parse', '--path-format=absolute', '--git-dir', '--git-common-dir'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split('\n');
    return out.length === 2 ? out : null;
  } catch {
    return null;
  }
}

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => join(e.parentPath, e.name))
    .sort();
}

const root = resolve(process.argv[2] ?? '.');
const ctx = join(root, '.project-context');
const readme = join(root, 'README.md');
const problems = [];

if (!existsSync(readme) || !existsSync(ctx)) {
  console.error(`${root}: missing README.md or .project-context/`);
  process.exit(1);
}

const files = [readme, ...markdownFiles(ctx)];
const texts = new Map();
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  texts.set(f, text);
  const size = statSync(f).size;
  const limit = f === readme ? ROOT_LIMIT : FILE_LIMIT;
  const rel = relative(root, f);
  if (size > limit) problems.push(`SIZE  ${rel}: ${size} > ${limit} bytes`);
  for (const [, link] of text.matchAll(LINK)) {
    if (link.includes('://')) continue;
    if (!existsSync(normalize(join(dirname(f), link)))) problems.push(`LINK  ${rel}: broken link ${link}`);
  }
}

const rootText = texts.get(readme);
const allText = [...texts.values()].join('\n');
for (const entry of readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
  const { name } = entry;
  if (name.startsWith('.') || !statSync(join(root, name)).isDirectory()) continue;
  const dirs = gitDirs(join(root, name));
  const isWorktree = dirs && realpathSync(dirs[0]) !== realpathSync(dirs[1]);
  if (isWorktree) {
    if (!allText.includes(`\`${name}`)) problems.push(`TREE  ${name}: worktree of ${basename(dirname(dirs[1]))} not in any project file: delete it if temporary, or list it in the owning project's file if long-lived`);
  } else if (!rootText.includes(`\`${name}\``)) {
    problems.push(`INDEX ${name}: directory not in root README project table`);
  }
}

const sizes = files.map((f) => [statSync(f).size, relative(root, f)]).sort((a, b) => a[0] - b[0]);
const total = sizes.reduce((sum, [s]) => sum + s, 0);
const [maxSize, maxFile] = sizes.at(-1);
console.log(`${files.length} files, ${total} bytes total; largest: ${maxFile} (${maxSize})`);
if (problems.length) {
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('OK');
