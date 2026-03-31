#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PKG_ROOT = resolve(__dirname, '..');

const IGNORE = new Set(['node_modules', 'bin', 'package.json', '.npmignore', '.git', '.gitignore', 'CLAUDE.md', '.github']);

const TARGETS = ['.claude', '.opencode', '_orcl', 'opencode.json', 'AGENTS.md'];

function getFiles(dir, base) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    if (IGNORE.has(entry)) continue;
    const full = join(dir, entry);
    const rel = relative(base, full);
    const st = statSync(full);
    if (st.isDirectory()) {
      results.push(...getFiles(full, base));
    } else {
      results.push(rel);
    }
  }
  return results;
}

function collectFiles() {
  const files = [];
  for (const target of TARGETS) {
    const src = join(PKG_ROOT, target);
    if (!existsSync(src)) continue;
    const st = statSync(src);
    if (st.isDirectory()) {
      files.push(...getFiles(src, PKG_ROOT));
    } else {
      files.push(target);
    }
  }
  return files;
}

function install(dest) {
  const files = collectFiles();
  let copied = 0;
  let skipped = 0;

  for (const rel of files) {
    const target = join(dest, rel);
    if (existsSync(target)) {
      console.log(`  ⚠  skip (exists): ${rel}`);
      skipped++;
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(PKG_ROOT, rel), target);
    console.log(`  ✓  ${rel}`);
    copied++;
  }

  console.log(`\n  ${copied} fichier(s) copié(s), ${skipped} ignoré(s).`);
}

function update(dest, force) {
  const files = collectFiles();
  let copied = 0;
  let skipped = 0;
  let available = 0;

  for (const rel of files) {
    const target = join(dest, rel);
    const src = join(PKG_ROOT, rel);

    if (!existsSync(target)) {
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(src, target);
      console.log(`  ✓  ${rel} (nouveau)`);
      copied++;
      continue;
    }

    if (force) {
      copyFileSync(src, target);
      console.log(`  ✓  ${rel} (écrasé)`);
      copied++;
      continue;
    }

    // Compare files
    const srcBuf = readFileSync(src);
    const dstBuf = readFileSync(target);
    if (!srcBuf.equals(dstBuf)) {
      console.log(`  ℹ  ${rel} — mise à jour disponible (utilisez --force pour écraser)`);
      available++;
    } else {
      skipped++;
    }
  }

  console.log(`\n  ${copied} fichier(s) copié(s), ${skipped} identique(s), ${available} mise(s) à jour disponible(s).`);
}

// --- CLI ---
const args = process.argv.slice(2);
const command = args.find(a => !a.startsWith('-'));
const force = args.includes('--force');
const dest = process.cwd();

console.log('\n  orcl-ai\n');

switch (command) {
  case 'install':
    console.log('  Installation des fichiers ORCL...\n');
    install(dest);
    break;
  case 'update':
    console.log(`  Mise à jour des fichiers ORCL${force ? ' (--force)' : ''}...\n`);
    update(dest, force);
    break;
  default:
    console.log('  Usage : npx orcl-ai <install|update> [--force]\n');
    console.log('  Commandes :');
    console.log('    install   Copie les fichiers ORCL dans le projet courant');
    console.log('    update    Met à jour les fichiers (nouveaux uniquement, sauf --force)');
    console.log('');
    process.exit(command ? 1 : 0);
}

console.log('');
