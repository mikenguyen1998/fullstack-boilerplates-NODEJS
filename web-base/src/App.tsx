import { Link, NavLink, Route, Routes } from 'react-router';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header>
        <Link className="brand" to="/">
          Web Base
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>Web Base · Built for the open web.</footer>
    </>
  );
}

function Home() {
  return (
    <>
      <p className="eyebrow">Your next website starts here</p>
      <h1>
        A simple foundation.
        <br />
        Room for your ideas.
      </h1>
      <p className="intro">
        A clean, responsive starting point for your business, portfolio, or next project. Every page
        is open to everyone.
      </p>
      <Link className="button" to="/about">
        Explore the template →
      </Link>
      <section className="features" aria-label="Features">
        <article>
          <h2>Public by default</h2>
          <p>Visitors can browse every page immediately.</p>
        </article>
        <article>
          <h2>Ready for any screen</h2>
          <p>A flexible layout for phones, tablets, and desktops.</p>
        </article>
        <article>
          <h2>Make it yours</h2>
          <p>Replace the content and styles to bring your project to life.</p>
        </article>
      </section>
    </>
  );
}

function About() {
  return (
    <>
      <p className="eyebrow">About this template</p>
      <h1>
        Start small.
        <br />
        Build something useful.
      </h1>
      <p className="intro">
        Use this space to introduce your project, tell your story, and help visitors understand what
        you offer.
      </p>
      <Link className="button" to="/">
        Back to home
      </Link>
    </>
  );
}

function NotFound() {
  return (
    <>
      <p className="eyebrow">404</p>
      <h1>Page not found.</h1>
      <p className="intro">The page you are looking for does not exist.</p>
      <Link className="button" to="/">
        Back to home
      </Link>
    </>
  );
}
