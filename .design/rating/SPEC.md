# Rating

**Job.** Show or collect a score on a fixed scale (1–5 by default), in any product: reviews, satisfaction, priority.
**Group.** Inputs

## Public API

| Prop       | Type                      | Default   | Description                                                               |
| ---------- | ------------------------- | --------- | ------------------------------------------------------------------------- |
| value      | number                    | 0         | Current score, 0 to `max`.                                                |
| max        | number                    | 5         | Number of steps.                                                          |
| onChange   | (value: number) => void   | —         | Called with the new score when the user picks a step. Omit for read-only. |
| readOnly   | boolean                   | false     | Shows the score without interaction.                                      |
| size       | 'sm' \| 'default' \| 'lg' | 'default' | Icon size.                                                                |
| disabled   | boolean                   | false     | Not interactive, dimmed.                                                  |
| aria-label | string                    | required  | Accessible name for the group, e.g. "Rate this item".                     |

## States

| State         | How it is reached           | What changes                                  |
| ------------- | --------------------------- | --------------------------------------------- |
| default       | interactive, has `onChange` | filled stars up to `value`, empty beyond      |
| hover         | pointer over a step         | steps up to the hovered one preview as filled |
| focus-visible | keyboard focus on a step    | ring on the focused step                      |
| read-only     | `readOnly` or no `onChange` | no hover preview, steps are not buttons       |
| disabled      | `disabled`                  | opacity 50 %, no interaction                  |
| empty         | `value` 0                   | all steps empty                               |

## Anatomy

1. `div` root, `role="radiogroup"`, `data-slot="rating"`, carries `aria-label`.
2. One `button` per step, `role="radio"`, `aria-checked` when it equals `value`, `aria-label="<n> of <max>"`, `data-slot="rating-step"`, `data-state="filled" | "empty"`.
3. `Star` icon (lucide) inside each step; filled steps use `fill-current`.
   Read-only: steps render as `span` with `aria-hidden`, and the root carries `aria-label="<value> of <max>"` with `role="img"`.

## Accessibility

Radio group semantics; arrow keys move between steps (native radio behaviour via roving tabindex); Enter/Space select; filled vs empty is conveyed by `aria-checked` and the label, not colour alone.

## Open questions

- Half steps: out of scope for the scaffold.
