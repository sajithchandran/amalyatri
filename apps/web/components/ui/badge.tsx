import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide',
  {
    variants: {
      variant: {
        forest: 'bg-forest-100 text-forest-800 border border-forest-200',
        clay: 'bg-clay-100 text-clay-800 border border-clay-200',
        sun: 'bg-sun-100 text-sun-800 border border-sun-200',
        rose: 'bg-rose-100 text-rose-700 border border-rose-200',
        ghost: 'bg-transparent border border-forest-700/20 text-forest-800',
        solid: 'bg-forest-700 text-cream',
      },
    },
    defaultVariants: { variant: 'forest' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
