# Test plan

Six tests, about an hour, on a clean clone. Each has the command, what you should see, and the pass criterion. Record the result in the last column; anything that fails becomes the next cycle's list.

Setup once:

```sh
git clone https://github.com/TitoHansen/HansenSystem.git && cd HansenSystem
npm install --legacy-peer-deps
npm run build
```

Tests T1–T3 need only Node. T4–T6 need Claude Code opened in the repository folder (`claude` in the terminal, or the desktop app with this folder). The token MCP server registers itself from `.mcp.json`; accept it when Claude Code asks.

| #   | Test                               | Needs             | Result |
| --- | ---------------------------------- | ----------------- | ------ |
| T1  | Catalogue and brand switcher       | Node              |        |
| T2  | New brand end to end               | Node              |        |
| T3  | Routing without a model            | Node              |        |
| T4  | A screen designed by the assistant | Claude Code       |        |
| T5  | A design checked by the assistant  | Claude Code + MCP |        |
| T6  | A component added by the assistant | Claude Code       |        |

---

## T1 — Catalogue and brand switcher (10 min)

```sh
npm run storybook
```

Opens http://localhost:6006 after building the three brands.

Do:

1. Sidebar → Core → Inputs → Form → "Sign-up form".
2. Toolbar **Brand**: switch hansen → Ipê Invest → Alva Care.
3. Toolbar **Mode**: Light → Dark.
4. Sidebar → Core → Feedback → Alert → "Status palette".

Expect:

- Same form, three looks: black/square (hansen), green/rounded (Ipê), blue/pill (Alva). No rebuild, no reload.
- Dark mode: canvas and card go dark, text stays readable, in every brand.
- Status palette: five alerts (default, info, success, warning, destructive) with tinted fills and readable ink in both modes.

Pass: all three brands and both modes render the same stories with no console errors and no unstyled component.

## T2 — New brand end to end (10 min)

Create `brands/teste.json`:

```json
{
  "primary": "#7C3AED",
  "neutralTint": "#6B6B7B",
  "tertiary": "#F59E0B",
  "headingFont": "Manrope",
  "bodyFont": "Inter",
  "radius": 1.0,
  "spacing": 1.0,
  "identity": {
    "name": "Teste",
    "industry": "Any",
    "tagline": "Prova do pipeline."
  }
}
```

```sh
npm run build:brands
npm run storybook
```

Expect:

- `build:brands` prints three brands plus `teste`, no contrast failures reported for `teste` (or a count, which is information, not a failure of the test).
- `.storybook/public/brands/teste/variables.css` and `theme.css` exist.
- Toolbar **Brand** lists "Teste"; Core stories turn purple with amber accents; dark mode works.

Pass: the new brand appears in the switcher and themes every Core story without touching any component. Afterwards, delete `brands/teste.json` and run `npm run build:brands` again; "Teste" disappears.

## T3 — Routing without a model (5 min)

```sh
npm run ask -- "a three-step onboarding: account, phone, preferences"
npm run ask -- "check the onboarding step 2 for accessibility"
npm run ask -- "hand off the onboarding flow"
npm run ask -- "add a Rating component, 1 to 5 stars"
npm run ask -- "change primary to #0B6E4F"
npm run ask -- "hello"
```

Expect, in order: `new-experience`, `ui-craft`, `handoff`, `component (engineer path)`, `token change (quality path)`, `(none)` with the five routes listed. Each prints the ordered skills with a one-line description.

Pass: six routes as listed. (This is the first pass the `/design` router starts from; the model can still override it with context.)

## T4 — A screen designed by the assistant (15 min)

In Claude Code, inside the repository:

```
/design-start
```

Choose **Create or explore a design** → **Something brand new** → target **Responsive web**, then describe: `an order confirmation screen: summary, next steps, one primary action`.

Expect:

- A receipt naming the route (new-experience) and the skills it will use, in plain words.
- `.design/order-confirmation/` with a flow or screen description (states, components from the Core set: Card, Alert, Button, Stepper or Breadcrumb) and copy in the active brand's voice (`design-corpus/brand/GUIDELINES.md`).
- No sector assumptions (no currency, no product names) unless the active brand's guidelines carry them.

Pass: the folder exists, the components named are real `@ds/ui` components, and the copy is neutral. Note any step where the assistant asked something the context already answered, or named a skill/file path in the options: both are deviations from `design-start.md`.

## T5 — A design checked by the assistant (10 min)

```
/design check the order confirmation screen for accessibility
```

Expect:

- Route `ui-craft`, only `ui/a11y-check` loaded (not the whole battery).
- Findings with rule IDs (`DS-A11Y-…`) and severities; contrast figures come from the MCP `contrast_check` tool (the assistant should say it called it).
- If the MCP is not connected the assistant must say so, not invent numbers.

Pass: findings carry rule IDs; contrast values match what `npm run check audit` reports for the active brand (spot-check one pair).

## T6 — A component added by the assistant (15 min)

Reference run: `.design/rating/` (SPEC.md and SCAFFOLD.md) and `packages/ui/src/components/rating.tsx` were produced by following `handoff/component-scaffold` by hand. Reproduce with a different component:

```
add a Tag component: a removable chip with a label and an optional icon, sizes sm and default, read-only variant
```

Expect, in order:

1. Gate 0: a short-form `SPEC.md` shown (props, states, anatomy, a11y) and a question to confirm. Nothing written yet.
2. Gate 1: a dry-run preview of three files — `packages/ui/src/components/tag.tsx`, the export line in `packages/ui/src/index.ts`, `stories/ui/Tag.stories.tsx` — with a theme-binding table and "raw values: 0".
3. After "yes": files written; tsc, eslint, `npm run build-storybook` reported; the visual gate lists three brands × two modes.
4. Storybook: Core → Content (or Inputs) → Tag renders in every brand; remove button has an `aria-label`.

Pass: no reference to `packages/components-react` or `stories/components`; no hex, px radius or font in `tag.tsx`; the component appears in the switcher for all brands. Compare the shape of `tag.tsx` with `rating.tsx` and `badge.tsx`; it should read as the same family.

---

## Recording deviations

For each failure note: the test, what you typed, what came back (first lines are enough), and which of these it is:

- **Wrong target** (wrote outside `packages/ui` / `stories/ui`)
- **Wrong convention** (raw value, old import, CSF2, sector copy)
- **Skipped gate** (wrote without showing the preview)
- **Asked too much / too little**
- **Tooling** (build, MCP, Storybook)

That list is the input for the next cycle.
