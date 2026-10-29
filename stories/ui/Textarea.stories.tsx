import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from '@ds/ui/components/textarea';
import { Field, FieldDescription, FieldLabel } from '@ds/ui/components/field';

const meta = {
  title: 'Core/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { placeholder: 'Add a note', disabled: false },
  decorators: [(Story) => <div className="w-96">{Story()}</div>]
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCounter: Story = {
  name: 'With label and limit',
  render: (args) => (
    <Field>
      <FieldLabel htmlFor="note">Message</FieldLabel>
      <Textarea
        {...args}
        id="note"
        maxLength={280}
        rows={4}
        aria-describedby="note-help"
      />
      <FieldDescription id="note-help">Up to 280 characters.</FieldDescription>
    </Field>
  )
};
