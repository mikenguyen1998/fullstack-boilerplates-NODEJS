import { Spinner } from '@/components/ui/Spinner';

export function PageLoader() {
  return (
    <div className="text-brand-600 flex min-h-[50vh] items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}
