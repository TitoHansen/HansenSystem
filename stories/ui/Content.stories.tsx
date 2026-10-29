import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@ds/ui/components/card';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '@ds/ui/components/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@ds/ui/components/accordion';
import { Separator } from '@ds/ui/components/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@ds/ui/components/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '@ds/ui/components/popover';
import { Button } from '@ds/ui/components/button';
import { Badge } from '@ds/ui/components/badge';

const meta = {
  title: 'Core/Content/Content',
  tags: ['autodocs'],
  parameters: { layout: 'padded' }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardDefault: Story = {
  name: 'Card',
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Monthly summary</CardTitle>
        <CardDescription>Updated a few minutes ago</CardDescription>
        <CardAction>
          <Badge variant="success">On track</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm">
        Three of four goals are complete. One is waiting on a review.
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm">
          Dismiss
        </Button>
        <Button size="sm">Open</Button>
      </CardFooter>
    </Card>
  )
};

export const Avatars: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Avatar>
        <AvatarImage src="" alt="" />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>JK</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JK</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>MR</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
};

export const AccordionDefault: Story = {
  name: 'Accordion (FAQ)',
  render: () => (
    <Accordion type="single" collapsible className="max-w-lg">
      <AccordionItem value="a">
        <AccordionTrigger>Can I change my plan later?</AccordionTrigger>
        <AccordionContent>
          Yes. Changes take effect at the start of the next cycle.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>How do I export my data?</AccordionTrigger>
        <AccordionContent>
          From Settings, choose Export and pick a format.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Is there a free trial?</AccordionTrigger>
        <AccordionContent>Fourteen days, no card required.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
};

export const SeparatorDefault: Story = {
  name: 'Separator',
  render: () => (
    <div className="max-w-sm text-sm">
      <p>Section one</p>
      <Separator className="my-3" />
      <p>Section two</p>
      <div className="mt-3 flex h-5 items-center gap-3">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
        <Separator orientation="vertical" />
        <span>Blog</span>
      </div>
    </div>
  )
};

export const TooltipAndPopover: Story = {
  name: 'Tooltip and Popover',
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Short, non-essential hint.</TooltipContent>
        </Tooltip>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <PopoverHeader>
              <PopoverTitle>Why we ask</PopoverTitle>
              <PopoverDescription>
                Richer content that stays until dismissed.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  )
};
