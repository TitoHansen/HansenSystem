import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from '@ds/ui/components/checkbox';
import { RadioGroup, RadioGroupItem } from '@ds/ui/components/radio-group';
import { Switch } from '@ds/ui/components/switch';
import { Label } from '@ds/ui/components/label';
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@ds/ui/components/field';

const meta = {
  title: 'Core/Inputs/Choice controls',
  tags: ['autodocs'],
  parameters: { layout: 'centered' }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxDefault: Story = {
  name: 'Checkbox',
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="c1" />
        <Label htmlFor="c1">Send me updates</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c2" defaultChecked />
        <Label htmlFor="c2">Remember this device</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="c3" disabled />
        <Label htmlFor="c3">Unavailable option</Label>
      </div>
    </div>
  )
};

export const Radio: Story = {
  name: 'Radio group',
  render: () => (
    <FieldSet>
      <FieldLegend>Delivery</FieldLegend>
      <RadioGroup defaultValue="standard" className="gap-3">
        {[
          ['standard', 'Standard', '3–5 business days'],
          ['express', 'Express', 'Next business day'],
          ['pickup', 'Pick up', 'Ready in 2 hours']
        ].map(([v, l, d]) => (
          <Field key={v} orientation="horizontal">
            <RadioGroupItem value={v} id={`r-${v}`} />
            <div className="flex flex-col">
              <FieldLabel htmlFor={`r-${v}`}>{l}</FieldLabel>
              <FieldDescription>{d}</FieldDescription>
            </div>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  )
};

export const SwitchDefault: Story = {
  name: 'Switch',
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="s1" />
        <Label htmlFor="s1">Notifications</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="s2" defaultChecked />
        <Label htmlFor="s2">Two-factor authentication</Label>
      </div>
    </div>
  )
};
