import { describe, expect, it } from 'vitest';

import { cn, safeRedirectPath } from '@/utils';

describe('utils', () => {
  it('cn merges conflicting tailwind classes', () => {
    expect(cn('px-2 py-1', false && 'hidden', 'px-4')).toBe('py-1 px-4');
  });

  it('safeRedirectPath blocks open redirects', () => {
    expect(safeRedirectPath('/dashboard')).toBe('/dashboard');
    expect(safeRedirectPath('//evil.com', '/')).toBe('/');
    expect(safeRedirectPath('https://evil.com', '/')).toBe('/');
    expect(safeRedirectPath(null, '/home')).toBe('/home');
  });
});
