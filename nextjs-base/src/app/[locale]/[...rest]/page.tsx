import { notFound } from 'next/navigation';

/** Catch-all so unknown localized paths render `[locale]/not-found.tsx`. */
export default function CatchAllPage() {
  notFound();
}
