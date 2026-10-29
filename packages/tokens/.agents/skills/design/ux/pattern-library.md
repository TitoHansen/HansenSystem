---
name: pattern-library
description: The catalogue of experience patterns that recur in almost every product journey, whatever the segment — navigation and wayfinding, lists and cards, detail views, forms and authentication, multi-step flows, confirmation and destructive actions, the empty/error/loading state trio, and settings. Each pattern names when to use it, its anatomy in @ds/ui core components, content and state rules, accessibility and motion, and links down to motion/interaction-patterns and the corpus.
license: MIT
metadata:
  category: design/ux
  pillar: ux
  agents: [Designer, PM, Design Engineer]
  autonomy: autonomous
  portable: true
  cadence: weekly
  mcp_tool: ux_patterns
---

# Pattern Library

## Purpose

`motion/interaction-patterns` catalogues component-level motions (modal-open, toast-appear, sheet-drag). This skill sits one altitude up: the _experience_ patterns that recur across product journeys regardless of industry — how a list is built, how a form reports an error, how a multi-step flow keeps its place. When `ux/flow-design` needs "the house way to do a list", it comes here rather than inventing one.

The library is segment-agnostic by design. Nothing in it assumes a news product, a bank, a shop or a clinic. Segment-specific content (what a row holds, what a step collects, what the copy says) comes from the active brand's `GUIDELINES.md` and `DESIGN-LANGUAGE.md`, never from this file.

Every pattern is assembled from the `@ds/ui` core (`packages/ui/src/components`) and existing interaction patterns. This library names the assembly, not new primitives. Where a pattern needs something the core does not have, it says so and points at governance.

## Preconditions

1. `foundation/design-dna` and `ux/experience-principles` are loaded as preamble.
2. Component reality is checked against `packages/ui/src/components/` and the Storybook `Core/*` stories.
3. Corpus evidence, where it exists, is cited per `foundation/corpus-guide`.

## Inputs

- `pattern` — optional: name one pattern to return in full. Default: list all with one-line summaries.
- `context` — optional surface to tailor the guidance.

## How to read a pattern card

Each card has: **When to use** · **Anatomy** (core components) · **Content rules** · **States** · **Accessibility** · **Motion** (→ `motion/interaction-patterns`) · **Evidence** (corpus / prior art). Cards are guidance, not law; the DNA and the rules outrank them.

## The patterns

### Navigation and wayfinding

**When to use.** Any experience that spans more than one view, or sits inside the product's global chrome.
**Anatomy.** Global chrome (not redesigned per feature) · section navigation (`Tabs`, `NavigationMenu` or `Sidebar`) · `Breadcrumb` only where the hierarchy is genuinely deep · a persistent way back (experience-principle 5).
**Content rules.** Labels are real section names, sentence case, no invented destinations. Locale and casing follow the brand guidelines.
**States.** Current location is always marked (`aria-current`). Loading nav is rare; render it statically.
**Accessibility.** Nav is a landmark; the current item carries `aria-current="page"`; skip-to-content is present on full pages.
**Motion.** `hover-feedback` only. Route transitions are calm (DNA: motion is invisible).
**Evidence.** `design-corpus/distilled/ux-patterns/navigation-search.md` when populated.

### Lists and cards

**When to use.** Any surface presenting many items of the same kind — records, products, conversations, results.
**Anatomy.** A repeating `Card` (title, optional supporting text, optional `Badge` for status, optional `Avatar`/media, one primary action) or a `Table` when the items are compared on the same attributes. Lists compose on the grid (`ux/page-templates`). Row-level actions live in a `DropdownMenu` behind an icon `Button`.
**Content rules.** One title per item. Supporting text is optional and short. Status is a `Badge` with a status variant (`info`/`success`/`warning`/`destructive`), never colour alone. Timestamps relative for recent, absolute beyond a day.
**States.** Loading = `Skeleton` matching the final layout. Empty = the `Empty` component with one action, never a blank grid. Variable text lengths must not break the card (design-critique density rules).
**Accessibility.** A clickable card is one link or button with an accessible name from the title; nested actions are separate, non-overlapping targets. Tables carry a caption and `th` scope.
**Motion.** `hover-feedback` only. No scroll-reveal on every card (DNA anti-pattern).
**Evidence.** `layout-patterns.md#card-anatomy` (corpus vN) when populated.

### Detail view

**When to use.** One item opened from a list: a record, an order, a profile, a document.
**Anatomy.** Heading block (title, status `Badge`, meta line) · primary and secondary actions top-right · content sections, each with a heading · related items rail · `Breadcrumb` or back link to the list.
**Content rules.** The title repeats the list item's title exactly. Actions are verbs. Secondary information collapses into an `Accordion` rather than scrolling forever.
**States.** Loading = `Skeleton` for the heading block and first section. Error = `Alert` with retry. Deleted/archived = a quiet banner and disabled actions.
**Accessibility.** One `h1`; heading levels sequential; the action group is a toolbar with an accessible name.
**Motion.** None beyond `hover-feedback`; opening from a list may use a calm route transition.
**Evidence.** `layout-patterns.md#detail` when populated.

### Forms and authentication

**When to use.** Any data entry: sign-in, sign-up, profile, checkout, request, configuration.
**Anatomy.** `Field` (label · control · `FieldDescription` · `FieldError`) grouped in a `FieldGroup`; controls from `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`; one primary `Button` plus one secondary; inside a `Card` when the form is the whole page.
**Content rules.** Labels are nouns, visible, never placeholder-only. Help text says what is expected before the error says what went wrong. Errors say how to fix, in one sentence. Required marks are consistent across the product.
**States.** Pristine · focused · invalid (`aria-invalid`, `FieldError` linked by `aria-describedby`) · disabled · submitting (primary button loading, inputs read-only) · submitted (`Toast` success or a confirmation view).
**Accessibility.** Every control has a programmatic label; errors are announced; focus moves to the first invalid field on submit; `autocomplete` attributes are set.
**Motion.** `field-focus`, `error-appear` (short, no shake).
**Evidence.** `ux-patterns/onboarding.md` when populated.

### Multi-step flow

**When to use.** A task too long for one screen: onboarding, application, checkout, configuration wizard.
**Anatomy.** `Stepper` (horizontal on wide viewports, vertical on narrow) · one form section per step · back and continue actions · a review step before commit · a done step with the next action.
**Content rules.** Step labels are nouns (Account, Details, Review). The review step repeats the user's input verbatim with an edit link per section. Never ask twice for the same information.
**States.** Current step (`aria-current="step"`), completed (clickable to go back), upcoming, step-with-error. Progress persists across reload where the platform allows.
**Accessibility.** The stepper is an ordered list; focus moves to the step heading on change; back never loses data.
**Motion.** Calm step transition (opacity + short slide), gated on reduced-motion.
**Evidence.** `ux-patterns/onboarding.md` when populated.

### Confirmation and destructive actions

**When to use.** Anything irreversible or costly: delete, cancel, pay, send.
**Anatomy.** `AlertDialog` with a title that states the consequence, one sentence of description, a cancel action that keeps the item, and a confirm action named for the verb (`Delete`, not `OK`). The destructive `Button` variant only on the destructive verb.
**Content rules.** Say what will happen and whether it can be undone. No double negatives. Undo via `Toast` action where the system can genuinely reverse it.
**States.** Open · confirming (confirm button loading, cancel disabled) · done (`Toast`).
**Accessibility.** Focus lands on the cancel action; Escape cancels; the dialog is labelled by its title.
**Motion.** `modal-open` / `modal-close`.
**Evidence.** prior art only; mark evidence "none yet" until the corpus has it.

### Empty, error and loading (the state trio)

**When to use.** Every surface that fetches, lists or computes — before, during and after.
**Anatomy.** Loading = `Skeleton` in the final layout, or `Progress` when duration is known. Empty = `Empty` (icon, title, one line, one action). Error = `Alert` (`destructive`) with a plain cause and a retry `Button`; inline for a section, full-surface for a page.
**Content rules.** Empty states name what will appear and how to make it appear. Errors never blame the user and never show raw codes without a plain sentence first.
**States.** The trio is designed together so the layout does not jump between them.
**Accessibility.** Loading regions carry `aria-busy`; errors are announced via `role="alert"`; retry is a real button.
**Motion.** Skeleton pulse or shimmer per the brand's `skeleton` setting; no bouncing spinners.
**Evidence.** `ui/state-matrix` for the component-level states.

### Settings and preferences

**When to use.** Profile, notifications, security, billing, appearance — anything the user configures.
**Anatomy.** Grouped rows (label · current value · control) under section headings; `Switch` for booleans, `Select` for enumerations, `Dialog` or `Sheet` for edits that need more than one field; left `Sidebar` of groups on wide viewports.
**Content rules.** Row labels describe the setting, not the control. Changes with consequences get a confirmation (`AlertDialog`); the rest save in place.
**States.** Saving (row-level), saved (`Toast`), failed (inline `Alert`).
**Accessibility.** Each control labelled by its row label; sections are landmarks.
**Motion.** `in-place-edit`.
**Evidence.** `layout-patterns.md#account` when populated.

## Output Contract

Listing mode returns the pattern names with one-line summaries. Single-pattern mode returns the full card. Both end with:

```json
{
  "skill": "design/ux/pattern-library",
  "patterns": [
    "navigation",
    "lists-cards",
    "detail-view",
    "forms-auth",
    "multi-step-flow",
    "confirmation-destructive",
    "state-trio",
    "settings"
  ],
  "returned": "<pattern name or 'all'>",
  "component_gaps": [],
  "evidence": { "corpus_version": "<vN or null>" }
}
```

## Error Handling

- **Pattern not in the library.** Say so. Recommend `ux/flow-design` to design it from prior art, and note it as a candidate to add here once validated.
- **Pattern needs a component the core does not ship.** Name the gap and route to governance; do not pretend the component exists.
- **Corpus empty.** Cards stand on the DNA and prior art; mark evidence "none yet".
- **A pattern would violate a principle** (e.g. a destructive action with no cancel). The principle wins; correct the card usage.
- **A request brings segment-specific rules** (regulatory text, currency formatting, clinical language). Apply them from the brand's guidelines; do not fold them into this library.

## Composition

- `compose_after`: `design/foundation/design-dna`, `design/ux/experience-principles`
- `compose_before`: `design/ux/flow-design`, `design/ux/page-templates`, `design/ui/design-critique`
- `calls`: `motion/interaction-patterns`, `design/foundation/corpus-guide`

## Related skills

- `../motion/interaction-patterns.md` — the component-level motions these patterns use
- `./flow-design.md` — assembles these patterns into a journey
- `./page-templates.md` — the page layouts these patterns sit within
- `./microcopy.md` — the copy inside these patterns
