import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Auth',
  description: 'A session-based web starter.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link className="brand" href="/">
            Next.js Auth
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">Log in</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>Session-based web starter.</footer>
      </body>
    </html>
  );
}
