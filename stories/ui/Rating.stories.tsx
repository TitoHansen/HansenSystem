import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Rating } from '@ds/ui/components/rating';
import { Field, FieldDescription, FieldLabel } from '@ds/ui/components/field';

const meta = {
  title: 'Core/Inputs/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    readOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    value: { control: { type: 'number', min: 0, max: 5 } }
  },
  args: {
    value: 3,
    max: 5,
    size: 'default',
    readOnly: false,
    disabled: false,
    'aria-label': 'Rating'
  }
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive: click or use arrow keys. */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);
    return <Rating {...args} value={value} onChange={setValue} />;
  }
};

export const ReadOnly: Story = { args: { readOnly: true, value: 4 } };
export const Empty: Story = { args: { value: 0, readOnly: true } };
export const Disabled: Story = { args: { disabled: true, value: 2 } };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <Rating {...args} readOnly size="sm" />
      <Rating {...args} readOnly />
      <Rating {...args} readOnly size="lg" />
    </div>
  )
};

/** In a form field, with the current score announced in the help text. */
export const InAField: Story = {
  name: 'In a field',
  render: (args) => {
    const [value, setValue] = useState(0);
    return (
      <Field className="w-72">
        <FieldLabel id="rate-label">How was it?</FieldLabel>
        <Rating
          {...args}
          value={value}
          onChange={setValue}
          aria-label="How was it"
        />
        <FieldDescription>
          {value ? `${value} of ${args.max}` : 'Pick a score'}
        </FieldDescription>
      </Field>
    );
  }
};
