# Start here

Hansen System is a white-label design system: feed it a brand file and everything (colours, type, spacing, components) takes that brand. This page is the human index. It lists what you can ask for, the exact words, and what you get back. `README.md` has the concept and the architecture; `AGENTS.md` is the same index written for the AI assistant.

## The three layers

1. **Brand** — `brands/<slug>.json`. Seed colours, fonts, radius, density, material, identity and guidelines. Three ship: `hansen` (neutral baseline), `ipe-invest` (fictional investments), `alva-care` (fictional health). Edit visually with `npm run controller`, or edit the file.
2. **Machine** — the token engine derives every colour (ramps, hover, soft fills, inks, all contrast-checked) and Style Dictionary writes CSS, SCSS and Swift. `npm run build:brands` runs it for every brand.
3. **Catalogue** — Storybook (`npm run storybook`). Section **Core** holds the segment-agnostic components; the toolbar switches brand and light/dark live.

A fourth, optional layer is the set of skills an AI assistant (Claude Code, Cursor, Copilot, Codex, Continue) follows when you ask for design or engineering work. It does nothing on its own; every item below starts with you typing.

## Ten things you can ask for

| #   | You want                             | Type this                                                                                                          | You get                                                                                                                  |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | A new brand                          | `npm run controller` → set colours, fonts, shape → **Save & apply** → `npm run build:brands -- --save-active acme` | `brands/acme.json`, all outputs rebuilt, "Acme" in the Storybook switcher                                                |
| 2   | To see the components in a brand     | `npm run storybook` → toolbar **Brand** / **Mode**                                                                 | Every Core story re-themed live                                                                                          |
| 3   | To know what a request would trigger | `npm run ask "a three-step onboarding"`                                                                            | The route and the ordered skills, printed; no model involved                                                             |
| 4   | A new flow or screen designed        | `/design a three-step onboarding: account, phone, preferences`                                                     | `.design/onboarding/flow.md` (screens, states, decisions) and `copy.md`                                                  |
| 5   | A quick exploration                  | `/design-start` → **Rough idea, fast**                                                                             | A fast, rough pass; nothing saved to the source tree                                                                     |
| 6   | A design checked                     | `/design check the onboarding step 2 for accessibility` (or `everything`, `copy`, `light vs dark`, `motion`)       | Findings with rule IDs and severity; a score for the full review                                                         |
| 7   | A handoff packet                     | `/design hand off the onboarding flow` (Figma file open in the desktop app)                                        | `.design/onboarding/PACKET.md`: layout, tokens by value, state grid, breakpoints, a11y                                   |
| 8   | A screen built from a design         | `/engineer-start` → **Build a screen from a design** → point at `.design/<feature>/` or a Figma link               | `sandbox/<date>-<name>/` with the screens, a manifest and light/dark captures                                            |
| 9   | A component added to the system      | `add a Rating component: 1–5 stars, read-only and interactive, with a size variant`                                | `packages/ui/src/components/rating.tsx`, the export, `stories/ui/Rating.stories.tsx` under Core, verified in every brand |
| 10  | A token changed safely               | `change primary to #0B6E4F`                                                                                        | Impact listed, approval asked for protected layers, `tokens.json` edited, outputs rebuilt                                |

Items 4–9 run inside the assistant. The skills are text the assistant reads; the router (`packages/tokens/.agents/skills/design/design-router.md`) picks three to eight of them per request. You never need to name a skill, though you can ("load `ux/pattern-library` and give me the multi-step flow card").

## Setup, once

```sh
npm install --legacy-peer-deps
npm run build            # packages + token outputs
npm run storybook        # http://localhost:6006
```

For the assistant: open the repository folder in Claude Code (or your editor). `.mcp.json` registers the token MCP server automatically, which gives the skills real token lookup, contrast and scoring. The Figma desktop app with its Dev Mode MCP server is optional, for items 6–8 from a Figma file.

## Where things land

- Brand and tokens: `brands/`, `packages/tokens/src/`, generated outputs under `packages/theme-*` and `packages/ui/src/styles/theme.css`.
- Design work: `.design/<feature>/`.
- Generated screens: `sandbox/<run>/`, one folder per run, never overwritten.
- Components and stories: `packages/ui/src/components/`, `stories/ui/`.
- Brand knowledge the agents read: `design-corpus/brand/GUIDELINES.md` (generated from the active brand) and `design-corpus/distilled/` (from your own screenshots, via `/design learn from these screenshots`).

## The rules that keep it safe

- `brands/` and `packages/tokens/src` are the source of truth; when something disagrees with them, they win.
- Never edit the foundation layer by hand; use the controller or the `quality/*` skills, which ask for approval.
- `packages/ui` is the only component library. A component that is not there is not in the system.
- Everything is segment-agnostic except the brand files. Sector rules go in `identity` and `guidelines`, never in components, templates or skills.
- Skills are symlinked into the editor folders; if you move one, run `npm run sync:skills`.

## Testing what you have

`TEST-PLAN.md` is a one-hour script with six tests (catalogue, new brand, routing, screen, review, new component), each with its command, expected result and pass criterion.
