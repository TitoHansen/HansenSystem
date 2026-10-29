import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Inbox } from 'lucide-react';
import { Progress } from '@ds/ui/components/progress';
import { Skeleton } from '@ds/ui/components/skeleton';
import { Badge } from '@ds/ui/components/badge';
import { Button } from '@ds/ui/components/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@ds/ui/components/empty';

const meta = {
  title: 'Core/Feedback/Status',
  tags: ['autodocs'],
  parameters: { layout: 'padded' }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Badges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(
        [
          'default',
          'secondary',
          'outline',
          'ghost',
          'info',
          'success',
          'warning',
          'destructive'
        ] as const
      ).map((v) => (
        <Badge key={v} variant={v} className="capitalize">
          {v}
        </Badge>
      ))}
    </div>
  )
};

export const ProgressBar: Story = {
  name: 'Progress',
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>Uploading</span>
          <span className="text-muted-foreground tabular-nums">35%</span>
        </div>
        <Progress value={35} aria-label="Upload progress" />
      </div>
      <Progress value={100} aria-label="Complete" />
    </div>
  )
};

export const SkeletonLoading: Story = {
  name: 'Skeleton (loading)',
  render: () => (
    <div
      className="flex max-w-sm items-center gap-4"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
};

export const EmptyState: Story = {
  name: 'Empty state',
  render: () => (
    <Empty className="max-w-md border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>Nothing here yet</EmptyTitle>
        <EmptyDescription>
          Items you create will show up in this list.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create the first one</Button>
      </EmptyContent>
    </Empty>
  )
};
