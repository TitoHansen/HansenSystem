# Hansen System — instructions for AI coding assistants

This file is read by Claude Code, Cursor, Codex, Copilot and Continue when a session opens in this repository. It is the single entry point; the per-editor folders (`.claude/`, `.cursor/`, `.codex/`, `.continue/`, `.github/`) only mirror it and the skills.

## What this repository is

A white-label design system: one brand file in, a themed token set, platform outputs and a component library out. It is segment-agnostic by contract. Nothing in the components, templates or skills may assume a sector; sector rules live in `brands/<slug>.json` (`identity`, `guidelines`) and in `design-corpus/brand/GUIDELINES.md`, which is generated from the active brand.

## Sources of truth, in precedence order

1. `brands/<slug>.json` — the brand. `brands/index.json` names the active one.
2. `packages/tokens/src/tokens.json` — tokens, written by the engine. Never edit the foundation layer by hand; go through the controller (`npm run controller`) or the `quality/*` skills.
3. `packages/ui/src/components/` — the only component library (`@ds/ui`: shadcn/ui on Tailwind v4, plus the system's own additions). New components go here and nowhere else.
4. `stories/ui/` — Storybook, section **Core**, groups Actions · Inputs · Feedback · Navigation · Overlays · Content.
5. `packages/tokens/.agents/skills/` — the skills, indexed in `skills.json`. The router is `design/design-router.md`.

## How work is requested

| The person wants                                         | Entry                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Set or change a brand                                    | `npm run controller`, then `npm run build:brands -- --save-active <slug>`               |
| Design something (flow, screen, copy, critique, handoff) | `/design-start` (guided) or `/design <request>` (routed)                                |
| Build something (screen, component, platform output)     | `/engineer-start`                                                                       |
| Add a component to the system                            | `design/agents/build-agent` → `design/handoff/component-scaffold`                       |
| Change a token safely                                    | `quality/token-lookup` → `quality/token-modification-gates` → `quality/safe-token-edit` |
| See which skills a request would load                    | `npm run ask "<request>"`                                                               |

The router classifies a request into one of five routes (prototype, ui-craft, new-experience, handoff, corpus-distill) and loads only that route's skill sequence. Do not load skills speculatively.

## Conventions every generated artefact follows

- **Components**: `packages/ui/src/components/<kebab-name>.tsx`, `cva` variants, `cn` from `../lib/utils`, Tailwind classes only, colours from the theme map (`bg-primary`, `text-muted-foreground`, `bg-success-soft text-success-soft-foreground`, …), `data-slot` on styled parts, semantic HTML first, `lucide-react` icons, export appended to `packages/ui/src/index.ts`. No raw hex, px radius, font family or new dependency. Canonical examples: `stepper.tsx`, `badge.tsx`.
- **Stories**: `stories/ui/<Name>.stories.tsx`, CSF3 with `satisfies Meta`, `tags: ['autodocs']`, title `Core/<Group>/<Name>`, one story per state, brand-neutral copy, imports from `@ds/ui/components/*`.
- **Screens**: composed from `@ds/ui` and `packages/ui/src/blocks`, written to `sandbox/<date>-<name>/` with a `MANIFEST.md`. Never overwrite a previous run.
- **Design artefacts**: `.design/<feature>/` (SPEC.md, STATE_MATRIX.md, flow.md, copy.md, PACKET.md, reports).
- **Done means**: builds (`npm run build`, `npm run build-storybook`), lints, and renders correctly in every brand in `brands/index.json` in both colour modes.

## Gates

Writing into `packages/ui`, `packages/tokens/src` or `brands/` requires approval; the skills that do it are dry-run by default. Foundation and palette token layers require the `quality/token-modification-gates` approval. Nothing is pushed or published by an agent.

## Verification commands

```sh
npm run build            # packages + token outputs
npm run build:brands     # every brand → .storybook/public/brands/<slug>/
npm run build-storybook  # static Storybook (runs build:brands first)
npm run check            # the controller's own battery (tokens, gallery, browser, audit…)
npm run lint
npm run ask "<request>"  # route + skills, no model involved
```

## Tone

Plain, direct, no filler. Ask one question when two routes are tied; otherwise proceed and state the assumption at the top of the artefact.
