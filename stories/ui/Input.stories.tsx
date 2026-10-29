import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@ds/ui/components/input';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@ds/ui/components/field';

const meta = {
  title: 'Core/Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url']
    },
    disabled: { control: 'boolean' }
  },
  args: { placeholder: 'Type here', type: 'text', disabled: false },
  decorators: [(Story) => <div className="w-80">{Story()}</div>]
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = {
  args: { disabled: true, value: 'Read only value' }
};

export const WithLabelAndHelp: Story = {
  name: 'With label and help text',
  render: (args) => (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input {...args} id="email" type="email" placeholder="you@example.com" />
      <FieldDescription>
        We only use this to send your receipt.
      </FieldDescription>
    </Field>
  )
};

export const Invalid: Story = {
  render: (args) => (
    <Field data-invalid="true">
      <FieldLabel htmlFor="email-err">Email</FieldLabel>
      <Input
        {...args}
        id="email-err"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
        aria-describedby="email-err-msg"
      />
      <FieldError id="email-err-msg">
        Enter an email in the form name@domain.
      </FieldError>
    </Field>
  )
};

export const Required: Story = {
  render: (args) => (
    <Field>
      <FieldLabel htmlFor="name">
        Full name{' '}
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      </FieldLabel>
      <Input
        {...args}
        id="name"
        required
        aria-required="true"
        autoComplete="name"
      />
    </Field>
  )
};
