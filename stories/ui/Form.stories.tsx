import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@ds/ui/components/button';
import { Input } from '@ds/ui/components/input';
import { Checkbox } from '@ds/ui/components/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ds/ui/components/select';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from '@ds/ui/components/field';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@ds/ui/components/card';

const meta = {
  title: 'Core/Inputs/Form',
  tags: ['autodocs'],
  parameters: { layout: 'centered' }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The canonical journey form: label, control, help, error, primary + secondary action. */
export const SignUp: Story = {
  name: 'Sign-up form',
  render: () => (
    <Card className="w-[420px]">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Takes about a minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="f-name">Full name</FieldLabel>
              <Input id="f-name" autoComplete="name" />
            </Field>
            <Field data-invalid="true">
              <FieldLabel htmlFor="f-email">Email</FieldLabel>
              <Input
                id="f-email"
                type="email"
                autoComplete="email"
                defaultValue="ana@"
                aria-invalid="true"
                aria-describedby="f-email-err"
              />
              <FieldError id="f-email-err">
                Enter a complete email address.
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="f-pass">Password</FieldLabel>
              <Input
                id="f-pass"
                type="password"
                autoComplete="new-password"
                aria-describedby="f-pass-help"
              />
              <FieldDescription id="f-pass-help">
                At least 8 characters.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="f-country">Country</FieldLabel>
              <Select>
                <SelectTrigger id="f-country" className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="br">Brazil</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <FieldSeparator />
            <Field orientation="horizontal">
              <Checkbox id="f-terms" />
              <FieldLabel htmlFor="f-terms" className="font-normal">
                I agree to the terms and the privacy policy.
              </FieldLabel>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button type="submit">Create account</Button>
      </CardFooter>
    </Card>
  )
};
