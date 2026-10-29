# Component Scaffold — Rating

> Feature: rating Group: Core/Inputs
> Scaffolded: 2026-10-29 Dry run: false
> Reference run: this folder is the worked example for TEST-PLAN.md, test T6.

## Files

| Path                                  | Purpose                                                               |
| ------------------------------------- | --------------------------------------------------------------------- |
| packages/ui/src/components/rating.tsx | Component (cva size variants; interactive radiogroup / read-only img) |
| packages/ui/src/index.ts              | Export added                                                          |
| stories/ui/Rating.stories.tsx         | Stories: Default, ReadOnly, Empty, Disabled, Sizes, In a field        |

## Theme bindings

| Visual decision | Class                              | Resolves to                                 |
| --------------- | ---------------------------------- | ------------------------------------------- |
| filled step ink | text-warning-soft-foreground       | --warning-soft-foreground (solved per mode) |
| empty step ink  | text-muted-foreground/50           | --muted-foreground at 50 %                  |
| hover preview   | hover:text-warning-soft-foreground | --warning-soft-foreground                   |
| focus ring      | focus-visible:ring-ring/50         | --ring                                      |
| disabled        | opacity-50                         | —                                           |
| icon size       | [&_svg]:size-4 / size-5 / size-7   | Tailwind scale → --spacing                  |

Raw values: 0. Dependencies added: 0.

## Verification

- tsc: pass
- eslint: pass
- storybook build: pass
- visual gate: hansen, ipe-invest, alva-care × light, dark — captured; keyboard (ArrowRight ×2 → "3 of 5") verified

## Decision recorded

The raw `--warning` fill is not an ink: #ffa300 on white is 1.9:1 and the dark-mode fill is near-black. Filled steps therefore use `--warning-soft-foreground`, the ink the engine solves for page surfaces in both modes. This is the rule for any status icon drawn directly on the page.

## Follow-up

- [ ] Half-step values (out of scope for the scaffold)
- [ ] Tests per react/testing.md
- [ ] Docs via storybook/component-documentation-writing
- [ ] Figma counterpart via figma-integration/component-lifecycle-orchestration
