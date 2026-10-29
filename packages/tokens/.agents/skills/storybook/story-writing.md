---
name: story-writing
description: Write Storybook stories in CSF3 for @ds/ui components, under the Core section, with one story per state, autodocs, and no brand- or segment-specific content. Generates type-safe story files from a component's props or a designer's description.
license: MIT
metadata:
  category: storybook
  agents: [Architect, Code, Testing]
  autonomy: autonomous
  portable: true
---

# Storybook Story Writing (CSF3)

## Purpose

Generate production-quality stories for components in `packages/ui/src/components/`, in the format the existing `stories/ui/*.stories.tsx` files use. A designer describes what they want; the agent writes the file. Stories are what the brand switcher and the visual gate run against, so every story must render correctly in every brand and both colour modes without any per-story theming.

## Preconditions

- The component exists in `packages/ui/src/components/<kebab-name>.tsx` and is exported from `packages/ui/src/index.ts`.
- Storybook builds (`npm run build-storybook`) or runs (`npm run storybook`). Both run `build:brands` first.

## Where stories live and how they are named

```
stories/ui/<ComponentName>.stories.tsx          one component
stories/ui/<Topic>.stories.tsx                   a small family (e.g. Choice.stories.tsx: Checkbox, Radio, Switch)
```

Title: `Core/<Group>/<Name>` where `<Group>` is one of `Actions`, `Inputs`, `Feedback`, `Navigation`, `Overlays`, `Content`. The sidebar order is fixed in `.storybook/preview.js`; a new group is a change to that file, not to a story.

Imports are from the package subpath, never relative to the source:

```tsx
import { Button } from '@ds/ui/components/button';
```

Icons from `lucide-react`. Never from `@ds/icons` in `@ds/ui` stories.

## Inputs

| Parameter     | Type     | Required | Description                                                    |
| ------------- | -------- | -------- | -------------------------------------------------------------- |
| componentName | string   | Yes      | PascalCase, as exported (`Rating`)                             |
| group         | string   | Yes      | Core group                                                     |
| states        | string[] | No       | From the spec's state matrix; defaults to what the props imply |
| description   | string   | No       | Natural-language description from the designer                 |

## Procedure

### Step 1: Read the component

Open the source. Note the props interface, the cva variants and their options, the `data-*` attributes that express state, and any required `aria-*` prop. Controls come from these; do not guess options.

### Step 2: Write the file

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Star } from 'lucide-react';
import { Rating } from '@ds/ui/components/rating';

const meta = {
  title: 'Core/Inputs/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    readOnly: { control: 'boolean' }
  },
  args: {
    value: 3,
    max: 5,
    size: 'default',
    readOnly: false,
    'aria-label': 'Rating'
  }
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ReadOnly: Story = { args: { readOnly: true } };
export const Empty: Story = { args: { value: 0 } };
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Rating {...args} size="sm" />
      <Rating {...args} />
      <Rating {...args} size="lg" />
    </div>
  )
};
```

Rules the file must follow:

- CSF3 objects with `satisfies Meta<typeof X>` and `StoryObj<typeof meta>`. No `Template.bind`.
- `tags: ['autodocs']` on the meta.
- `argTypes` for every cva variant (`select` with the real options) and every boolean.
- `args` provide a complete, sensible default so the Docs canvas renders at rest.
- Interaction handlers as `fn()` from `storybook/test` only when the story needs the Actions panel.
- `layout: 'centered'` for a single element, `'padded'` for a composition or anything wide.
- Width is set with a decorator or a wrapper `div` and Tailwind classes (`w-80`, `max-w-xl`), never inline style.

### Step 3: Cover the states

| State           | Include when                            | Story                                                         |
| --------------- | --------------------------------------- | ------------------------------------------------------------- |
| Default         | always                                  | `Default`                                                     |
| each variant    | the component has a `variant` or `size` | one story each, or one `AllVariants` grid when there are many |
| Disabled        | `disabled` prop                         | `Disabled`                                                    |
| Invalid / error | `aria-invalid` or an error prop         | `Invalid`                                                     |
| Loading         | a loading prop or pattern               | `Loading`                                                     |
| Empty           | the component shows a collection        | `Empty`                                                       |
| With icon       | accepts icons                           | `WithIcon`                                                    |
| In context      | the spec names a composition            | one composite story using other `@ds/ui` components           |

Hover and focus are not stories; they are visible through interaction and checked by `ui/state-matrix` and the a11y addon.

### Step 4: Keep stories brand-neutral

Story copy names a generic job ("Continue", "Create account", "Notifications"), never a company, a product, a sector or a currency. The brand switcher supplies the identity; a story that hard-codes a colour, a font or a radius is a bug. Example data is small, obviously illustrative and locale-neutral (`Intl.NumberFormat(undefined, …)` when numbers must be formatted).

### Step 5: Validate

```sh
npx eslint stories/ui/<ComponentName>.stories.tsx
npm run build-storybook
```

Then open the story in each brand (toolbar → Brand) and both modes (toolbar → Mode), or run `ui/visual-regression-gate`. The story is done when it reads correctly in every combination.

## Checklist

- [ ] File in `stories/ui/`, title `Core/<Group>/<Name>`
- [ ] CSF3 with `satisfies Meta`, `tags: ['autodocs']`
- [ ] Imports from `@ds/ui/components/*`, icons from `lucide-react`
- [ ] `argTypes` for every variant, `args` complete
- [ ] One story per spec state; composite story when a context is named
- [ ] No brand, sector, hex, font or inline style in the file
- [ ] eslint and `build-storybook` pass; renders in every brand × mode

## Anti-patterns

```tsx
// ❌ CSF2
const Template = (args) => <Rating {...args} />;
export const Primary = Template.bind({});

// ❌ relative import to source, hard-coded theme
import { Rating } from '../../packages/ui/src/components/rating';
<div style={{ background: '#000' }}>…</div>;

// ❌ sector copy
args: {
  label: 'Comprar Tesouro Selic';
}

// ✅
import { Rating } from '@ds/ui/components/rating';
export const Default: Story = {};
args: {
  label: 'Continue';
}
```

## Error Handling

| Problem                  | Recovery                                                                      |
| ------------------------ | ----------------------------------------------------------------------------- |
| Component not exported   | Add the line to `packages/ui/src/index.ts` (see `handoff/component-scaffold`) |
| Controls missing         | `component` set in meta; `argTypes` lists the variant options                 |
| Story not in sidebar     | Title under `Core/<Group>`; file matches the glob in `.storybook/main.js`     |
| Looks wrong in one brand | The component is using a raw value; fix the component, not the story          |
| Fonts fall back          | Expected offline; the brand's Google Fonts load at runtime                    |

## Related skills

- `../design/handoff/component-scaffold.md` — writes the first version of a story alongside a new component
- `../react/shadcn-ui.md` — the theming contract the component under test follows
- `./visual-testing.md` — play functions and a11y checks on top of these stories
- `./storybook-config.md` — the brand switcher, groups and sidebar order
