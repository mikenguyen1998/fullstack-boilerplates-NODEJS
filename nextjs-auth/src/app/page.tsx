import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h1>A simple session-based starter.</h1>
      <p>Home is public. Log in to view your dashboard.</p>
      <Link className="button" href="/dashboard">
        Open dashboard
      </Link>
    </>
  );
}
