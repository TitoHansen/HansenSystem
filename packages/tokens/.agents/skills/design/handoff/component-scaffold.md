---
name: component-scaffold
description: Scaffold a new @ds/ui component from a handoff packet or a short brief. Writes the component (cva + Tailwind, bound to the brand theme tokens), registers the export, and writes a Core Storybook story with one story per state. Never invents - every prop, variant and state traces to SPEC.md (or the brief it writes first). Never overwrites existing files. Requires-approval autonomy.
license: MIT
metadata:
  category: design/handoff
  pillar: handoff
  agents: [Design Engineer, Code, Architect]
  autonomy: requires-approval
  portable: true
  cadence: weekly
---

# Component Scaffold

## Purpose

This skill turns a specified component into the three files the design system actually ships, in the conventions the other 62 components already follow:

```
packages/ui/src/components/<kebab-name>.tsx     the component (cva + Tailwind, theme tokens)
packages/ui/src/index.ts                         + one export line
stories/ui/<ComponentName>.stories.tsx           Core story, one StoryObj per state
```

Optionally, a fourth: `packages/tokens/docs/components/<kebab-name>/<ComponentName>.md` via `storybook/component-documentation-writing`, when the user asks for docs.

The scaffold is _minimal but compilable and themed_. It does not implement business logic. It does not invent props that are not in the spec. Every state from the spec becomes a story. Every colour, radius, spacing and type decision is a Tailwind class that resolves to a brand variable through `packages/ui/src/styles/shadcn.css`; there are no hard-coded hex, px radii or font names in a scaffolded component.

This is the first skill in the suite that writes code. It is `requires-approval` and never overwrites.

## The contract a scaffolded component follows

Read `packages/ui/src/components/stepper.tsx` and `badge.tsx` once before writing; they are the canonical patterns (one composed component, one cva-variant component).

1. **File and name.** `packages/ui/src/components/<kebab-name>.tsx`, named export at the bottom (`export { Rating, ratingVariants }`), PascalCase component, `<ComponentName>Props` interface extending the right `React.ComponentProps<'element'>`.
2. **Styling.** `cva` from `class-variance-authority` for variants, `cn` from `../lib/utils` to merge. Only Tailwind utilities. Colours come from the theme map: `bg-primary`, `text-muted-foreground`, `border-input`, `ring-ring/50`, `bg-success-soft text-success-soft-foreground`, `text-destructive`, and so on. Radius: `rounded-md` / `rounded-lg` / `rounded-full` (they resolve to the brand `--radius`). Spacing: Tailwind scale (resolves to the brand `--spacing`). Never `style={{ color: '#…' }}`, never a raw hex, never a font family.
3. **Status colours.** `info`, `success`, `warning`, `destructive` and their `-soft` / `-soft-foreground` pairs are the only status colours. They are solved by the token engine for WCAG AA; do not mix custom tints.
4. **Slots and state.** Every element that styles can target carries `data-slot="<kebab-name>-<part>"`; state goes in `data-*` attributes (`data-state`, `data-status`, `data-invalid`) so brands and tests can hook it. Dark mode is automatic through the theme variables; `dark:` utilities only when a one-off override is unavoidable.
5. **Accessibility.** The semantic element first (`button`, `ol`, `fieldset`, `input`); ARIA only where HTML has no answer (`aria-current`, `aria-invalid`, `aria-describedby`, `role="radiogroup"`). Focus: `outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50`. Disabled: `disabled:pointer-events-none disabled:opacity-50`. Any icon-only control has an `aria-label` prop that is required in the types.
6. **Icons.** `lucide-react`, imported by name, sized with `size-4` by default.
7. **Behaviour.** Props pass through (`...props`), no business logic. If the spec implies controlled/uncontrolled state, a `// TODO(scaffold): …` comment points at `react/state-management.md`; the scaffold ships the controlled form only.
8. **No new dependencies.** If the spec needs a primitive the repo does not have (a date engine, a virtualised list), stop and say so; do not add a package.

## Preconditions

1. One of:
   - a completed `.design/<feature>/` folder with `SPEC.md` (from `handoff/frame-to-spec`) and `STATE_MATRIX.md` (from `ui/state-matrix`), or
   - a **brief**: a few sentences from the user naming the component, its props and its states. In that case the skill first writes `.design/<feature>/SPEC.md` in the short form below and shows it; the user confirms before any code is generated.
2. `packages/ui/src/components/<kebab-name>.tsx` does not exist and `index.ts` has no export for it. If either exists, abort and point at `figma-integration/component-lifecycle-orchestration` (UPDATE mode).
3. `stories/ui/<ComponentName>.stories.tsx` does not exist.
4. Every visual value in the spec maps to a theme class (precondition for the "no raw values" rule). If a value has no token, stop and route to `ui/token-mapping-audit`.

### Short-form SPEC.md (brief mode)

```markdown
# <ComponentName>

**Job.** One sentence: what it is for, in any product.
**Group.** Actions | Inputs | Feedback | Navigation | Overlays | Content

## Public API

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

## States

| State | How it is reached | What changes |
| ----- | ----------------- | ------------ |

## Anatomy

Ordered list of parts, each with its semantic element and data-slot.

## Accessibility

Element roles, keyboard, announcements.

## Open questions
```

## Inputs

Required:

- `component_name` — PascalCase (e.g. `Rating`).
- one of `feature_name` (the `.design/<feature>/` folder) or `brief` (text).

Optional:

- `group` — Storybook group under Core: `Actions` | `Inputs` | `Feedback` | `Navigation` | `Overlays` | `Content`. Inferred from the spec's Job when omitted.
- `with_docs` — boolean, default false. When true, also runs `storybook/component-documentation-writing`.
- `dry_run` — boolean, default true. When true, prints every file it would write and writes nothing.

## Procedure

### Step 1: Verify preconditions

Check all four preconditions. In brief mode, write and show the short-form SPEC.md first and wait for a yes. If any check fails, list every blocker and stop.

### Step 2: Parse the spec

From SPEC.md extract: Public API → props interface and cva variants; States → one story each plus the `data-*` attributes that express them; Anatomy → the JSX tree and `data-slot` names; Accessibility → roles, keyboard handling, required `aria-*` props.

### Step 3: Generate the component

Write `packages/ui/src/components/<kebab-name>.tsx` following the contract above. Shape:

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Star } from 'lucide-react';

import { cn } from '../lib/utils';

/** <ComponentName> — <Job sentence from the spec>. */

const <camelName>Variants = cva('<base classes>', {
  variants: { size: { sm: '…', default: '…', lg: '…' } },
  defaultVariants: { size: 'default' }
});

export interface <ComponentName>Props
  extends Omit<React.ComponentProps<'div'>, 'onChange'>,
    VariantProps<typeof <camelName>Variants> {
  /** JSDoc copied from the spec's Description column. */
  value: number;
  onChange?: (value: number) => void;
  /** Required: accessible name for the group. */
  'aria-label': string;
}

function <ComponentName>({ className, size, value, onChange, ...props }: <ComponentName>Props) {
  return (
    <div data-slot="<kebab-name>" className={cn(<camelName>Variants({ size }), className)} {...props}>
      …
    </div>
  );
}

export { <ComponentName>, <camelName>Variants };
```

### Step 4: Register the export

Append `export * from './components/<kebab-name>';` to `packages/ui/src/index.ts`, keeping the list alphabetical where the file already is.

### Step 5: Generate the story

Write `stories/ui/<ComponentName>.stories.tsx` per `storybook/story-writing`: title `Core/<Group>/<ComponentName>`, `tags: ['autodocs']`, `satisfies Meta<typeof X>`, `argTypes` for every variant, one `StoryObj` per state in the spec, and one composite story that shows the component in context when the spec names one. Stories carry no brand- or segment-specific copy.

### Step 6: Dry run output or write

If `dry_run: true`, print every file prefixed `--- WOULD WRITE: <path> ---`. No writes.

If `dry_run: false`, write all files; on any failure, remove what this run created. The repo is never left half-scaffolded.

### Step 7: Verify

Run, and report the result of each:

```sh
npx tsc --noEmit -p packages/ui 2>/dev/null || npx tsc --noEmit --jsx react-jsx --esModuleInterop --skipLibCheck packages/ui/src/components/<kebab-name>.tsx
npx eslint packages/ui/src/components/<kebab-name>.tsx stories/ui/<ComponentName>.stories.tsx
npm run build-storybook
```

Then `ui/visual-regression-gate` on the new stories, across all brands in `brands/index.json` and both colour modes. A component that renders in one brand only is not done.

### Step 8: Scaffold report

Write `.design/<feature>/SCAFFOLD.md` using the Output Contract.

## Output Contract

```markdown
# Component Scaffold — <ComponentName>

> Feature: <feature_name> Group: Core/<Group>
> Scaffolded: <ISO timestamp> Dry run: <true | false>

## Files

| Path                                        | Purpose                        |
| ------------------------------------------- | ------------------------------ |
| packages/ui/src/components/<kebab-name>.tsx | Component                      |
| packages/ui/src/index.ts                    | Export added                   |
| stories/ui/<ComponentName>.stories.tsx      | Stories: <list of story names> |

## Theme bindings

| Visual decision | Class      | Resolves to |
| --------------- | ---------- | ----------- |
| fill            | bg-primary | --primary   |
| …               | …          | …           |

## Verification

- tsc: pass | fail (<message>)
- eslint: pass | fail
- storybook build: pass | fail
- visual gate: <brands> × <modes> captured | skipped (<why>)

## Follow-up

- [ ] Wire behaviour marked TODO(scaffold)
- [ ] Tests per react/testing.md
- [ ] Docs via storybook/component-documentation-writing (if not run)
- [ ] Figma counterpart via figma-integration/component-lifecycle-orchestration
```

## Error Handling

- **Collision.** Abort, list the paths, suggest UPDATE mode.
- **Unmapped visual value.** Abort; route to `ui/token-mapping-audit`. Never write a raw value to get past it.
- **Spec missing a section.** Abort and name it; in brief mode, ask one question and rewrite the short-form spec.
- **Needs a package the repo lacks.** Stop and say which; do not install.
- **Partial write failure.** Roll back this run's files before reporting.
- **tsc or eslint fail on the generated file.** Fix within the contract; if it needs a change outside the contract, stop and show the diff.

## Composition

- `compose_after`: `handoff/frame-to-spec`, `ui/state-matrix`, `ui/token-mapping-audit` (packet mode); none (brief mode)
- `compose_before`: `ui/visual-regression-gate`, `storybook/component-documentation-writing`, `handoff/code-connect-stub`
- `calls`: `storybook/story-writing`, `react/shadcn-ui`, `react/accessibility`, `react/typescript-patterns`

## Related Skills

- `../../react/shadcn-ui.md` — the theming contract this scaffold obeys
- `../../storybook/story-writing.md` — the story file this scaffold writes
- `../../react/state-management.md` — what to wire where a TODO(scaffold) sits
- `../../figma-integration/component-lifecycle-orchestration.md` — the Figma side of a new component

## Autonomy note

`requires-approval` because it writes into the published package. `dry_run: true` is the first gate; the PR review is the second.
