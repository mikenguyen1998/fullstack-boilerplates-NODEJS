import { Link, Outlet } from 'react-router';

export function Layout() {
  return (
    <>
      <header>
        <Link className="brand" to="/">
          React Auth
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Log in</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>Session-based web starter.</footer>
    </>
  );
}
