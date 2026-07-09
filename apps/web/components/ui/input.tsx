import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-12 w-full rounded-xl border border-forest-900/10 bg-white/60 px-4 py-2',
          'text-base text-ink placeholder:text-forest-700/40',
          'transition focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-forest-500/40 focus-visible:border-forest-700/40',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
