import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it } from 'vitest';

import { App } from './App';

afterEach(cleanup);

it('lets visitors navigate public pages without login', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A simple foundation.');
  await user.click(screen.getByRole('link', { name: 'About' }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Start small.');
});

it.each(['/about', '/missing'])('supports direct visits to %s without login', (path) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    path === '/about' ? 'Start small.' : 'Page not found.',
  );
  expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
});
