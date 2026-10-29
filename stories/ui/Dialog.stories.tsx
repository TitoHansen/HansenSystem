import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@ds/ui/components/button';
import { Input } from '@ds/ui/components/input';
import { Field, FieldLabel } from '@ds/ui/components/field';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@ds/ui/components/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@ds/ui/components/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@ds/ui/components/sheet';

const meta = {
  title: 'Core/Overlays/Dialogs',
  tags: ['autodocs'],
  parameters: { layout: 'centered' }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditDialog: Story = {
  name: 'Dialog (edit)',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit name</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit display name</DialogTitle>
          <DialogDescription>
            This is how others will see you.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="d-name">Display name</FieldLabel>
          <Input id="d-name" defaultValue="Ana Souza" />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export const ConfirmDestructive: Story = {
  name: 'Alert dialog (confirm)',
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the project and all of its data. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep project</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};

export const SidePanel: Story = {
  name: 'Sheet (side panel)',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow the list without leaving the page.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 text-sm text-muted-foreground">
          Filter controls go here.
        </div>
        <SheetFooter>
          <Button>Apply</Button>
          <Button variant="ghost">Reset</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
};
