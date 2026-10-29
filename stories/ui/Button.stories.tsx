import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArrowRight, Loader2, Plus } from 'lucide-react';
import { Button } from '@ds/ui/components/button';

const meta = {
  title: 'Core/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'outline',
        'ghost',
        'link',
        'destructive'
      ]
    },
    size: { control: 'select', options: ['xs', 'sm', 'default', 'lg', 'icon'] },
    disabled: { control: 'boolean' }
  },
  args: {
    children: 'Continue',
    variant: 'default',
    size: 'default',
    disabled: false
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Link: Story = { args: { variant: 'link' } };
export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' }
};
export const Disabled: Story = { args: { disabled: true } };

export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      Continue <ArrowRight />
    </Button>
  )
};

export const IconOnly: Story = {
  args: { size: 'icon', 'aria-label': 'Add item' },
  render: (args) => (
    <Button {...args}>
      <Plus />
    </Button>
  )
};

export const Loading: Story = {
  args: { disabled: true },
  render: (args) => (
    <Button {...args}>
      <Loader2 className="animate-spin" /> Saving…
    </Button>
  )
};

export const AllVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(
        [
          'default',
          'secondary',
          'outline',
          'ghost',
          'link',
          'destructive'
        ] as const
      ).map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  )
};
