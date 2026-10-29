import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@ds/ui/components/table';
import { Badge } from '@ds/ui/components/badge';

const meta = {
  title: 'Core/Content/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' }
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { id: 'INV-1042', name: 'Ana Souza', status: 'Paid', amount: 1250.0 },
  { id: 'INV-1043', name: 'Jonas Keller', status: 'Pending', amount: 320.5 },
  { id: 'INV-1044', name: 'Marie Roy', status: 'Overdue', amount: 89.99 },
  { id: 'INV-1045', name: 'Luís Prado', status: 'Paid', amount: 4800.0 }
];

const tone: Record<string, 'success' | 'warning' | 'destructive'> = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'destructive'
};

export const Default: Story = {
  render: () => (
    <Table className="max-w-2xl">
      <TableCaption>
        Recent records. Amounts in the viewer&apos;s locale.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-xs">{r.id}</TableCell>
            <TableCell>{r.name}</TableCell>
            <TableCell>
              <Badge variant={tone[r.status]}>{r.status}</Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: 'USD'
              }).format(r.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
};
