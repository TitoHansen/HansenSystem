import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@ds/ui/components/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@ds/ui/components/breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@ds/ui/components/pagination';
import { Stepper } from '@ds/ui/components/stepper';

const meta = {
  title: 'Core/Navigation/Navigation',
  tags: ['autodocs'],
  parameters: { layout: 'padded' }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TabsDefault: Story = {
  name: 'Tabs',
  render: () => (
    <Tabs defaultValue="overview" className="max-w-lg">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        Summary of the item.
      </TabsContent>
      <TabsContent value="activity" className="text-sm text-muted-foreground">
        Recent events.
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground">
        Preferences for this item.
      </TabsContent>
    </Tabs>
  )
};

export const BreadcrumbDefault: Story = {
  name: 'Breadcrumb',
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Website redesign</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
};

export const PaginationDefault: Story = {
  name: 'Pagination',
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
};

const steps = [
  { id: 'account', label: 'Account', description: 'Who you are' },
  { id: 'details', label: 'Details', description: 'What you need' },
  { id: 'review', label: 'Review', description: 'Check everything' },
  { id: 'done', label: 'Done' }
];

export const StepperHorizontal: Story = {
  name: 'Stepper (horizontal)',
  render: () => <Stepper steps={steps} current={1} className="max-w-2xl" />
};

export const StepperVertical: Story = {
  name: 'Stepper (vertical)',
  render: () => <Stepper steps={steps} current={2} orientation="vertical" />
};

export const StepperWithError: Story = {
  name: 'Stepper (step with error)',
  render: () => (
    <Stepper
      steps={[steps[0], { ...steps[1], error: true }, steps[2], steps[3]]}
      current={1}
      className="max-w-2xl"
    />
  )
};
