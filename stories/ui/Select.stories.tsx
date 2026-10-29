import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@ds/ui/components/select';
import { Field, FieldLabel } from '@ds/ui/components/field';

const meta = {
  title: 'Core/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' }
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field className="w-64">
      <FieldLabel htmlFor="lang">Language</FieldLabel>
      <Select>
        <SelectTrigger id="lang" className="w-full">
          <SelectValue placeholder="Choose a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Available</SelectLabel>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
            <SelectItem value="fr-CA">Français (Canada)</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-64" aria-label="Disabled select">
        <SelectValue placeholder="Unavailable" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    </Select>
  )
};
