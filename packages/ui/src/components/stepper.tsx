import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '../lib/utils';

/**
 * Stepper — progress through an ordered, multi-step journey (onboarding,
 * checkout, applications, wizards). Segment-agnostic by design: it knows
 * about steps and their state, nothing about what the steps contain.
 *
 * Accessibility: rendered as an ordered list; the current step carries
 * aria-current="step"; completed steps announce "completed" via sr-only text.
 */

type StepStatus = 'complete' | 'current' | 'upcoming';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  /** Optional: mark the step as having a validation problem. */
  error?: boolean;
}

export interface StepperProps extends React.ComponentProps<'ol'> {
  steps: StepperStep[];
  /** Zero-based index of the current step. */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  /** Called when a completed step is clicked; omit for a read-only stepper. */
  onStepClick?: (index: number) => void;
}

function statusOf(index: number, current: number): StepStatus {
  if (index < current) return 'complete';
  if (index === current) return 'current';
  return 'upcoming';
}

function Stepper({
  steps,
  current,
  orientation = 'horizontal',
  onStepClick,
  className,
  ...props
}: StepperProps) {
  const vertical = orientation === 'vertical';
  return (
    <ol
      data-slot="stepper"
      data-orientation={orientation}
      className={cn(
        'flex',
        vertical ? 'flex-col gap-0' : 'w-full flex-row items-start',
        className
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const status = statusOf(i, current);
        const last = i === steps.length - 1;
        const clickable = Boolean(onStepClick) && status === 'complete';
        const indicator = (
          <span
            data-slot="stepper-indicator"
            data-status={status}
            aria-hidden="true"
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
              status === 'complete' &&
                'border-primary bg-primary text-primary-foreground',
              status === 'current' &&
                'border-primary bg-background text-primary ring-4 ring-primary/15',
              status === 'upcoming' &&
                'border-border bg-background text-muted-foreground',
              step.error &&
                'border-destructive text-destructive ring-destructive/15'
            )}
          >
            {status === 'complete' ? <Check className="size-4" /> : i + 1}
          </span>
        );
        const text = (
          <span className="flex min-w-0 flex-col">
            <span
              className={cn(
                'text-sm font-medium',
                status === 'upcoming' && 'text-muted-foreground',
                step.error && 'text-destructive'
              )}
            >
              {step.label}
              {status === 'complete' && (
                <span className="sr-only"> (completed)</span>
              )}
            </span>
            {step.description && (
              <span className="text-muted-foreground text-xs">
                {step.description}
              </span>
            )}
          </span>
        );
        const connector = !last && (
          <span
            aria-hidden="true"
            className={cn(
              'bg-border',
              vertical ? 'ml-4 my-1 h-6 w-0.5' : 'mx-3 mt-4 h-0.5 flex-1',
              status === 'complete' && 'bg-primary'
            )}
          />
        );
        const body = clickable ? (
          <button
            type="button"
            onClick={() => onStepClick?.(i)}
            className="flex items-start gap-3 rounded-md text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {indicator}
            {text}
          </button>
        ) : (
          <span className="flex items-start gap-3">
            {indicator}
            {text}
          </span>
        );
        return (
          <li
            key={step.id}
            data-slot="stepper-step"
            data-status={status}
            aria-current={status === 'current' ? 'step' : undefined}
            className={cn(
              'flex',
              vertical
                ? 'flex-col'
                : 'flex-1 flex-row items-start last:flex-none'
            )}
          >
            {body}
            {connector}
          </li>
        );
      })}
    </ol>
  );
}

export { Stepper };
