---
name: page-templates
description: The page-level layout templates that recur in almost every product, whatever the segment. List, detail, form, multi-step flow, dashboard, and settings, each expressed on the DS responsive grid (Small, Medium, Large, XLarge viewports). Grounded in the grid reference and the design corpus. Tells a new full-page screen how to sit on the grid before it fills in content.
license: MIT
metadata:
  category: design/ux
  pillar: ux
  agents: [Designer, PM, Design Engineer]
  autonomy: autonomous
  portable: true
  cadence: weekly
  mcp_tool: ux_page_templates
---

# Page Templates

## Purpose

`ux/flow-design` decides a screen should be a full page. This skill decides how that page sits on the grid: how many columns, where the reading measure sits, how it reflows across viewports. It is the bridge between a flow and a real layout, expressed in the DS grid system rather than in arbitrary pixels.

Templates are starting points, not straitjackets. They encode layouts that hold across segments, so a new page inherits a proven rhythm instead of reinventing it. What fills a template (which records, which fields, which figures) comes from the brief and the active brand's guidelines, never from this file.

## Preconditions

1. `foundation/design-dna` and `ux/experience-principles` loaded as preamble.
2. The grid reference is the source of truth for columns and spacing: `packages/tokens/docs/reference/grid.md` (marked BETA) and the `viewport/*` token sets. Verify current values via `discovery/token-lookup` rather than trusting numbers memorised here.
3. Corpus `distilled/layout-patterns.md` is cited where it has evidence.

## Inputs

- `template` — `list` | `detail` | `form` | `flow` | `dashboard` | `settings` | `all`. Default `all` (list) or the one named.
- `viewport` — optional focus: `small` | `medium` | `large` | `xlarge`.

## The grid, briefly

Four viewports, columns increasing with width. Verify live values with `discovery/token-lookup` on the `grid` and `viewport/*` sets; the reference documents them and the token set is authoritative.

| Viewport | Columns  | Notes                                                                                                                              |
| -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Small    | 4        | phone; single column of content, list-first                                                                                        |
| Medium   | 12       | tablet                                                                                                                             |
| Large    | 10 or 12 | **known drift**: `grid.md` documents 10, `tokens.json` has 12. Confirm before building; tracked in `ui/monthly-audit` Known drift. |
| XLarge   | 12       | wide desktop                                                                                                                       |

Reading measure: body text never wider than about 8 columns / 60–75 characters (`DS-TYP-07`). Gutters and margins come from the grid tokens; spacing between sections uses fluid spacing (`spacing.fluid.*`, which scales by the viewport multiplier), spacing inside components uses static (`spacing.static.*`). This is the content-rhythm principle made concrete (DNA principle 3).

## The templates

### List

Many items of one kind: records, products, conversations, results.
**Layout.** Page heading with the primary action top-right; a filter/search row; then either a `Table` (full content width, horizontally scrollable on Small) or a card grid (1-up on Small, 2–3-up on Medium, 3–4-up on Large/XLarge). `Pagination` or load-more below.
**Reflow.** Cards reflow by column count; tables keep their columns and scroll, with the first column sticky where the platform allows.
**Anatomy source.** `ux/pattern-library` → lists and cards; state trio for loading/empty/error.

### Detail

One item opened from a list.
**Layout.** `Breadcrumb` or back link · heading block (title, status, meta) with actions top-right · main column of sections (max ~8 columns for readable text) · optional side rail (related items, summary) on Large/XLarge.
**Reflow.** Small: one column, rail stacks below the sections. Large/XLarge: the main column stays ~8 columns; extra width becomes margin or the rail, not longer lines.
**Anatomy source.** `ux/pattern-library` → detail view.

### Form

A single-screen data-entry task: sign-in, sign-up, request, edit.
**Layout.** One centred column, 4–6 columns wide on Large/XLarge, inside a `Card` when it is the whole page. Fields stack vertically; related short fields may pair horizontally on Medium and up. Actions at the bottom, primary on the right.
**Reflow.** Small: full width, paired fields unpair. The column never widens past comfortable reading.
**Anatomy source.** `ux/pattern-library` → forms and authentication.

### Multi-step flow

A task too long for one screen.
**Layout.** `Stepper` across the top (horizontal) on Medium and up, or down the left on XLarge; vertical and collapsed on Small. The current step renders as the Form template. Back and continue persist in the same place on every step.
**Reflow.** The stepper collapses to "Step 2 of 4" plus a progress bar on Small.
**Anatomy source.** `ux/pattern-library` → multi-step flow.

### Dashboard

An overview surface: a handful of key figures and a few lists or charts.
**Layout.** A row of stat `Card`s (2-up on Small, 4-up on Large) · one or two wide chart or table cards · a narrower activity list. Every card has a title and one way in.
**Reflow.** Cards reflow by column count; charts keep aspect ratio; tables scroll.
**States.** Each card owns its own loading/empty/error so one failure does not blank the page.
**Anatomy source.** `ux/pattern-library` → lists and cards; `dataviz` guidance for the charts.

### Settings

Utility pages: profile, preferences, security, billing.
**Layout.** A single narrow column of grouped rows (label, current value, control). Section headings group related settings. On Large/XLarge an optional left `Sidebar` lists the groups; content stays a readable single column, not stretched full-width.
**Reflow.** Small: stacked, the group nav becomes a top `Tabs` row or an `Accordion`.
**States.** In-place edit, `Toast` on save, inline `Alert` on failure, `AlertDialog` for consequential changes.
**Anatomy source.** `ux/pattern-library` → settings and preferences.

## Output Contract

Listing mode returns template names with one-line summaries. Single-template mode returns the full template with a per-viewport reflow table:

```markdown
# Page template — <name>

> Grid source: grid.md + viewport/\* tokens
> Corpus evidence: <vN or none>

## Layout

<the column structure and measure>

## Reflow

| Viewport | Columns         | Layout |
| -------- | --------------- | ------ |
| Small    | 4               | ...    |
| Medium   | 12              | ...    |
| Large    | 10/12 (confirm) | ...    |
| XLarge   | 12              | ...    |

## Components and patterns

<DS components; links to ux/pattern-library cards>

## Notes

<states, known drift>
```

Followed by:

```json
{
 "skill": "design/ux/page-templates",
 "template": "<name or all>",
 "grid_verified": <true|false>,
 "known_drift": ["grid Large columns 10 (docs) vs 12 (tokens)"],
 "evidence": { "corpus_version": "<vN or null>" }
}
```

## Error Handling

- **Grid values uncertain.** Do not guess. Look them up via `discovery/token-lookup` on the `grid`/`viewport` sets; if still ambiguous (the Large-column drift), present both and flag for confirmation.
- **Template does not fit the screen.** Say so and route to `ux/flow-design` to shape a new layout from prior art; propose adding it here once validated.
- **Content would break the reading measure.** The measure wins (`DS-TYP-07`); widen margins, not lines.
- **Corpus empty.** Templates stand on the grid reference and the DNA; mark evidence "none yet".

## Composition

- `compose_after`: `design/foundation/design-dna`, `design/ux/experience-principles`, `design/ux/flow-design`
- `compose_before`: `design/ui/design-critique`, `design/handoff/frame-to-spec`
- `calls`: `discovery/token-lookup`, `design/foundation/corpus-guide`

## Related skills

- `./flow-design.md` — decides which screens are full pages
- `./pattern-library.md` — the patterns that fill these templates
- `../ui/state-matrix.md` — the states each template's components need
- `packages/tokens/docs/reference/grid.md` — the grid source of truth (BETA)
