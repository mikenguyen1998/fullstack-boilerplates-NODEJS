import { useId, type InputHTMLAttributes, type Ref } from 'react';

import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

/** React 19: `ref` is a regular prop, no forwardRef needed. */
export function Input({ label, error, id, className, ref, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'focus:border-brand-500 focus:ring-brand-500/30 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm transition outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-900',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
