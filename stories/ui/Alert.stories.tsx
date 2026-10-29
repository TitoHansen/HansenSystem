import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@ds/ui/components/alert';

const meta = {
  title: 'Core/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'destructive']
    }
  },
  decorators: [(Story) => <div className="max-w-xl">{Story()}</div>]
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        You can change these settings later from your profile.
      </AlertDescription>
    </Alert>
  )
};

export const Info_: Story = {
  name: 'Info',
  render: () => (
    <Alert variant="info">
      <Info />
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        Some features will be unavailable on Sunday from 02:00 to 04:00.
      </AlertDescription>
    </Alert>
  )
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <CheckCircle2 />
      <AlertTitle>Saved</AlertTitle>
      <AlertDescription>Your changes are live.</AlertDescription>
    </Alert>
  )
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <TriangleAlert />
      <AlertTitle>Session expiring</AlertTitle>
      <AlertDescription>
        You will be signed out in 2 minutes. Save your work.
      </AlertDescription>
    </Alert>
  )
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        The card was declined. Try another method or contact your bank.
      </AlertDescription>
    </Alert>
  )
};

/** All variants side by side, useful for judging a brand's status palette. */
export const StatusPalette: Story = {
  name: 'Status palette',
  render: () => (
    <div className="flex flex-col gap-3">
      {(['default', 'info', 'success', 'warning', 'destructive'] as const).map(
        (v) => (
          <Alert key={v} variant={v}>
            <Info />
            <AlertTitle className="capitalize">{v}</AlertTitle>
            <AlertDescription>
              Soft fill and ink are solved by the token engine to clear WCAG AA.
            </AlertDescription>
          </Alert>
        )
      )}
    </div>
  )
};
