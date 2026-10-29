#!/usr/bin/env node
// Headless brand builder.
//
// Turns every brand file under brands/ into a themed CSS bundle the Storybook
// brand switcher can load at runtime, without opening the controller UI.
//
//   node tools/controller/cli/build-brands.mjs              # all brands
//   node tools/controller/cli/build-brands.mjs ipe-invest   # one brand
//   node tools/controller/cli/build-brands.mjs --active hansen
//
// For each brand it runs the same path the controller's "Save & apply" runs:
// computeSystem -> applySystem -> npm run build:output. The engine writes into
// the repo's token sources, so brands are built one at a time and the repo is
// left holding the *active* brand (brands/index.json "active", or --active).
//
// Output: .storybook/public/brands/<slug>/variables.css (token CSS variables),
//         .storybook/public/brands/<slug>/theme.css     (shadcn/ui theme),
//         .storybook/public/brands/index.json           (manifest for the toolbar).

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import {
  ROOT, DEFAULT_BRAND, computeSystem, applySystem, shadcnThemeCss
} from '../lib/engine.mjs';

const BRANDS_DIR = path.join(ROOT, 'brands');
const OUT_DIR = path.join(ROOT, '.storybook/public/brands');
const VARIABLES_CSS = path.join(ROOT, 'packages/theme-css/src/variables.css');
const REGISTRY = path.join(BRANDS_DIR, 'index.json');

const args = process.argv.slice(2);

// `--save-active <slug>`: snapshot whatever the controller UI last saved
// (tools/controller/brand.json) as a named brand file, then exit.
const saveFlag = args.indexOf('--save-active');
if (saveFlag !== -1) {
  const slug = args[saveFlag + 1];
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    console.error('usage: build-brands.mjs --save-active <slug>   (lowercase, digits, dashes)');
    process.exit(1);
  }
  const src = path.join(ROOT, 'tools/controller/brand.json');
  const dst = path.join(BRANDS_DIR, `${slug}.json`);
  fs.copyFileSync(src, dst);
  console.log(`✓ saved active brand as brands/${slug}.json — run "npm run build:brands" to publish it`);
  process.exit(0);
}
const activeFlag = args.indexOf('--active');
const activeArg = activeFlag !== -1 ? args[activeFlag + 1] : null;
const requested = args.filter((a, i) => !a.startsWith('--') && i !== activeFlag + 1);

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

function listBrands() {
  return fs.readdirSync(BRANDS_DIR)
    .filter((f) => f.endsWith('.json') && f !== 'index.json')
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
}

function loadBrandFile(slug) {
  const file = path.join(BRANDS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) throw new Error(`brand "${slug}" not found at ${file}`);
  const raw = readJson(file);
  // Strip nulls so DEFAULT_BRAND fills them, same as the controller does.
  for (const k of Object.keys(raw)) if (raw[k] === null) delete raw[k];
  return { ...DEFAULT_BRAND, ...raw };
}

function runBuildOutput() {
  const r = spawnSync('npm', ['run', 'build:output', '--silent'], {
    cwd: ROOT, shell: true, stdio: 'pipe', encoding: 'utf8'
  });
  if (r.status !== 0) {
    process.stderr.write(r.stdout.slice(-4000) + r.stderr.slice(-4000));
    throw new Error('build:output failed');
  }
}

function buildOne(slug) {
  const brand = loadBrandFile(slug);
  const system = computeSystem(brand);
  applySystem(brand, system);
  runBuildOutput();

  const dir = path.join(OUT_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(VARIABLES_CSS, path.join(dir, 'variables.css'));
  fs.writeFileSync(path.join(dir, 'theme.css'), shadcnThemeCss(brand, system));

  // audits = { light: [{fg,bg,ratio,aa,...}], dark: [...] } — count pairings under AA.
  const failing = ['light', 'dark']
    .flatMap((m) => system.audits?.[m] || [])
    .filter((a) => a.aa === false);
  return {
    slug,
    name: brand.identity?.name || slug,
    tagline: brand.identity?.tagline || '',
    primary: brand.primary,
    tertiary: brand.tertiary,
    headingFont: brand.headingFont,
    bodyFont: brand.bodyFont,
    radius: brand.radius,
    spacing: brand.spacing,
    material: brand.material?.preset,
    contrastFailures: failing.length
  };
}

const registry = fs.existsSync(REGISTRY) ? readJson(REGISTRY) : {};
const all = listBrands();
const targets = requested.length ? requested : all;
const active = activeArg || registry.active || targets[0];

if (!targets.includes(active) && requested.length) targets.push(active);

// Build the active brand last so the repo sources end up carrying it.
const order = [...targets.filter((s) => s !== active), active].filter((s, i, a) => a.indexOf(s) === i);

const manifestFile = path.join(OUT_DIR, 'index.json');
const manifest = fs.existsSync(manifestFile) ? readJson(manifestFile) : { brands: [] };
const built = new Map(manifest.brands.map((b) => [b.slug, b]));

for (const slug of order) {
  process.stdout.write(`◆ building brand "${slug}"… `);
  const t0 = Date.now();
  const entry = buildOne(slug);
  built.set(slug, entry);
  process.stdout.write(`${((Date.now() - t0) / 1000).toFixed(1)}s` +
    (entry.contrastFailures ? `  (${entry.contrastFailures} contrast audits failing)` : '') + '\n');
}

// Keep the Storybook default stylesheet pointing at the active brand too, so
// anything that still links /variables.css keeps working.
fs.copyFileSync(path.join(OUT_DIR, active, 'variables.css'), path.join(ROOT, '.storybook/public/variables.css'));

fs.mkdirSync(OUT_DIR, { recursive: true });
// Drop bundles for brands that no longer exist under brands/ (renamed or removed).
for (const d of fs.readdirSync(OUT_DIR, { withFileTypes: true })) {
  if (d.isDirectory() && !all.includes(d.name)) fs.rmSync(path.join(OUT_DIR, d.name), { recursive: true, force: true });
}
fs.writeFileSync(manifestFile, JSON.stringify({
  active,
  generatedAt: new Date().toISOString(),
  brands: all.filter((s) => built.has(s)).map((s) => built.get(s))
}, null, 2));
fs.writeFileSync(REGISTRY, JSON.stringify({ active, brands: all }, null, 2) + '\n');

console.log(`✓ ${order.length} brand(s) built → .storybook/public/brands/  (active: ${active})`);
