import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button — Amal Yatri design system.
 *
 * The aesthetic is calm, rounded, and grounded. Six variants cover ~95% of
 * use; reach for cva variants before adding custom button styles.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full ' +
    'text-sm font-medium tracking-wide ' +
    'transition-all focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-forest-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    '[&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-forest-700 text-cream hover:bg-forest-800 shadow-soft hover:shadow-glow',
        secondary:
          'bg-clay-100 text-ink hover:bg-clay-200 border border-clay-200',
        outline:
          'border border-forest-700/15 text-ink hover:bg-forest-700/5 hover:border-forest-700/40',
        ghost:
          'text-forest-800 hover:bg-forest-700/5',
        link:
          'text-forest-800 underline-offset-4 hover:underline px-0 py-0',
        destructive:
          'bg-rose-600 text-white hover:bg-rose-700',
      },
      size: {
        sm:  'h-9  px-4',
        md:  'h-11 px-6',
        lg:  'h-12 px-7 text-base',
        xl:  'h-14 px-9 text-base',
        icon:'h-10 w-10 px-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
