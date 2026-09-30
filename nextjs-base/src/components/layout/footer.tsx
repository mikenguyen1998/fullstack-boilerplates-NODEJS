import { env } from '@/config/env';

export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}
    </footer>
  );
}
