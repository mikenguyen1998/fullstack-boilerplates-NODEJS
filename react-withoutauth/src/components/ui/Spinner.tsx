import { cn } from '@/utils/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="loading"
      className={cn(
        'inline-block size-6 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
    />
  );
}
