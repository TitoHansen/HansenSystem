import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Star } from 'lucide-react';

import { cn } from '../lib/utils';

/**
 * Rating — show or collect a score on a fixed scale (1–5 by default), in any
 * product: reviews, satisfaction, priority. Segment-agnostic: it knows about
 * steps and a value, nothing about what is being rated.
 *
 * Interactive: a radio group of buttons (arrow keys move, Enter/Space select).
 * Read-only: a single image with an accessible "n of max" label.
 *
 * Colour: filled steps use the warning *ink* (`--warning-soft-foreground`),
 * which the token engine solves to read on page surfaces in both modes; the
 * raw warning fill is too light on white and too dark on black.
 */

const ratingVariants = cva('inline-flex items-center gap-0.5', {
  variants: {
    size: {
      sm: '[&_svg]:size-4',
      default: '[&_svg]:size-5',
      lg: '[&_svg]:size-7'
    }
  },
  defaultVariants: { size: 'default' }
});

export interface RatingProps
  extends Omit<React.ComponentProps<'div'>, 'onChange'>,
    VariantProps<typeof ratingVariants> {
  /** Current score, 0 to `max`. */
  value?: number;
  /** Number of steps. */
  max?: number;
  /** Called with the new score when the user picks a step. Omit for read-only. */
  onChange?: (value: number) => void;
  /** Shows the score without interaction. */
  readOnly?: boolean;
  /** Not interactive, dimmed. */
  disabled?: boolean;
  /** Accessible name for the group, e.g. "Rate this item". */
  'aria-label': string;
}

function Rating({
  className,
  size,
  value = 0,
  max = 5,
  onChange,
  readOnly = false,
  disabled = false,
  'aria-label': ariaLabel,
  ...props
}: RatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const interactive = !readOnly && !disabled && typeof onChange === 'function';
  const shown = interactive && hovered !== null ? hovered : value;
  const steps = Array.from({ length: Math.max(1, max) }, (_, i) => i + 1);

  if (!interactive) {
    return (
      <div
        data-slot="rating"
        role="img"
        aria-label={`${ariaLabel}: ${value} of ${max}`}
        data-disabled={disabled || undefined}
        className={cn(
          ratingVariants({ size }),
          disabled && 'opacity-50',
          className
        )}
        {...props}
      >
        {steps.map((step) => (
          <span
            key={step}
            data-slot="rating-step"
            data-state={step <= value ? 'filled' : 'empty'}
            aria-hidden="true"
            className={cn(
              'inline-flex',
              step <= value
                ? 'text-warning-soft-foreground [&_svg]:fill-current'
                : 'text-muted-foreground/50'
            )}
          >
            <Star />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      data-slot="rating"
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(ratingVariants({ size }), className)}
      onMouseLeave={() => setHovered(null)}
      {...props}
    >
      {steps.map((step) => {
        const checked = step === value;
        return (
          <button
            key={step}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${step} of ${max}`}
            tabIndex={checked || (value === 0 && step === 1) ? 0 : -1}
            data-slot="rating-step"
            data-state={step <= shown ? 'filled' : 'empty'}
            onMouseEnter={() => setHovered(step)}
            onFocus={() => setHovered(null)}
            onClick={() => onChange?.(step)}
            onKeyDown={(e) => {
              const next =
                e.key === 'ArrowRight' || e.key === 'ArrowUp'
                  ? Math.min(max, step + 1)
                  : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
                    ? Math.max(1, step - 1)
                    : null;
              if (next === null) return;
              e.preventDefault();
              onChange?.(next);
              const target = (e.currentTarget.parentElement?.children[
                next - 1
              ] ?? null) as HTMLElement | null;
              target?.focus();
            }}
            className={cn(
              'inline-flex rounded-sm outline-none transition-colors',
              'focus-visible:ring-[3px] focus-visible:ring-ring/50',
              step <= shown
                ? 'text-warning-soft-foreground [&_svg]:fill-current'
                : 'text-muted-foreground/50 hover:text-warning-soft-foreground'
            )}
          >
            <Star />
          </button>
        );
      })}
    </div>
  );
}

export { Rating, ratingVariants };
