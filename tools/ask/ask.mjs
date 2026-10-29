#!/usr/bin/env node
// `npm run ask "<request>"` — show which route and which skills a request would
// load, without involving a model. Reuses the router's own heuristic
// (packages/tokens/mcp-server/tools/design-route.js), so what this prints is the
// first pass the design-router skill starts from.
//
// Two things the /design router does not cover are recognised here so the answer
// is complete for the ten requests in START-HERE.md:
//   - adding a component to the system → the build-agent chain (an /engineer path)
//   - changing a token              → the quality gates chain

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { designRoute } from '../../packages/tokens/mcp-server/tools/design-route.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const request = process.argv.slice(2).join(' ').trim();

if (!request) {
  console.log('usage: npm run ask -- "<what you want, in a sentence>"');
  process.exit(1);
}

const q = request.toLowerCase();
const registry = JSON.parse(readFileSync(path.join(ROOT, 'packages/tokens/.agents/skills/skills.json'), 'utf8'));
const byName = Object.fromEntries(registry.skills.map((s) => [s.name, s]));

function describe(skillPath) {
  const name = skillPath.split('/').pop();
  const s = byName[name];
  return s ? `${skillPath}  —  ${s.description.split(/[.:]/)[0]}` : skillPath;
}

function print(route, sequence, note, entry) {
  console.log(`\nrequest : ${request}`);
  console.log(`route   : ${route}`);
  console.log(`entry   : ${entry}`);
  console.log('skills  :');
  sequence.forEach((s, i) => console.log(`  ${i + 1}. ${describe(s)}`));
  if (note) console.log(`\n${note}`);
  console.log();
}

// Non-/design paths first: they are not in the router's five routes.
const componentAsk = /\b(add|new|create|scaffold|build)\b.*\bcomponent\b|\bcomponent\b.*\b(add|new|create|scaffold|build)\b/.test(q);
const tokenAsk = /\b(token|primary|ramp|palette|change .* to #|hex)\b/.test(q) && !/component/.test(q);

if (componentAsk) {
  print(
    'component (engineer path)',
    [
      'design/foundation/design-dna',
      'react/shadcn-ui',
      'design/handoff/component-scaffold',
      'storybook/story-writing',
      'storybook/visual-regression-gate'
    ],
    'Run by design/agents/build-agent. Dry-run by default; writes to packages/ui/src/components and stories/ui only after approval.',
    'ask the build-agent, or /engineer-start → "Build a component"'
  );
  process.exit(0);
}

if (tokenAsk) {
  print(
    'token change (quality path)',
    [
      'discovery/token-lookup',
      'discovery/dependency-graph',
      'quality/token-modification-gates',
      'quality/safe-token-edit',
      'quality/build-verify'
    ],
    'Foundation and palette layers require approval. For brand colours prefer the controller: it derives the whole system from the seed.',
    'ask by skill name, e.g. "change primary to #0B6E4F"'
  );
  process.exit(0);
}

const r = designRoute({ request });
if (!r.route) {
  console.log(`\nrequest : ${request}`);
  console.log('route   : (none) — no clear signal');
  console.log('routes  : ' + Object.keys(r.all_routes).join(', '));
  console.log('\nThe design-router would ask one clarifying question. Try naming the job: "design a…", "check…", "hand off…", "prototype…", "learn from these screenshots".\n');
  process.exit(0);
}
print(
  `${r.route} (confidence ${r.confidence}${r.ambiguous ? ', tied — the router would ask one question' : ''})`,
  r.sequence,
  r.note,
  '/design <request>  (or /design-start for the guided version)'
);
