import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const exts = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const ignoreDirs = new Set(['node_modules', 'android', 'ios', '.git']);

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (ignoreDirs.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(js|jsx|ts|tsx)$/.test(e.name)) out.push(p);
  }
}

function extractImports(code) {
  const specs = new Set();
  const regexes = [
    /import\s+[^;\n]*?from\s+['\"]([^'\"]+)['\"]/g,
    /import\s+['\"]([^'\"]+)['\"]/g,
    /export\s+[^;\n]*?from\s+['\"]([^'\"]+)['\"]/g,
    /require\(\s*['\"]([^'\"]+)['\"]\s*\)/g,
  ];
  for (const rx of regexes) {
    let m;
    while ((m = rx.exec(code))) specs.add(m[1]);
  }
  return [...specs];
}

function resolveRelative(fromFile, spec) {
  const basedir = path.dirname(fromFile);
  const target = path.resolve(basedir, spec);
  if (fs.existsSync(target)) return true;
  for (const ext of exts) {
    if (fs.existsSync(target + ext)) return true;
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    for (const idx of ['index.js', 'index.jsx', 'index.ts', 'index.tsx', 'index.json']) {
      if (fs.existsSync(path.join(target, idx))) return true;
    }
  }
  return false;
}

function moduleExists(spec) {
  // Normalize @scope/name/sub -> @scope/name, name/sub -> name
  let pkg = spec;
  if (pkg.startsWith('.')) return true;
  if (pkg.startsWith('/')) return true;
  if (pkg.startsWith('@')) {
    const parts = pkg.split('/');
    if (parts.length >= 2) pkg = parts[0] + '/' + parts[1];
  } else {
    pkg = pkg.split('/')[0];
  }
  const nm = path.join(projectRoot, 'node_modules', pkg);
  return fs.existsSync(nm);
}

const files = [];
walk(projectRoot, files);

const missing = [];
for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  const specs = extractImports(code);
  for (const spec of specs) {
    if (spec.startsWith('.') || spec.startsWith('/')) {
      if (!resolveRelative(file, spec)) missing.push({ file, spec, type: 'relative' });
    } else {
      if (!moduleExists(spec)) missing.push({ file, spec, type: 'module' });
    }
  }
}

if (missing.length === 0) {
  console.log('All imports resolved successfully.');
} else {
  console.log('Missing imports found:');
  for (const m of missing) {
    console.log(`- [${m.type}] ${m.spec}  in  ${path.relative(projectRoot, m.file)}`);
  }
  process.exitCode = 1;
}

