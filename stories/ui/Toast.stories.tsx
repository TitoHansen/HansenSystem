import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toast } from 'sonner';
import { Toaster } from '@ds/ui/components/sonner';
import { Button } from '@ds/ui/components/button';

const meta = {
  title: 'Core/Feedback/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <>
        {Story()}
        <Toaster position="bottom-right" />
      </>
    )
  ]
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast('Draft saved')}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success('Profile updated')}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('New version available')}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning('Connection is unstable')}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Could not upload the file')}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast('Item archived', {
            action: { label: 'Undo', onClick: () => toast('Restored') }
          })
        }
      >
        With action
      </Button>
    </div>
  )
};
