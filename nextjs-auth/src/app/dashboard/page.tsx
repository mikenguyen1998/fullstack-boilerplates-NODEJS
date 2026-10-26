import { requireSession } from '@/lib/session';
import { Logout } from './logout';

export default async function Dashboard() {
  const user = await requireSession();
  return (
    <>
      <h1>Dashboard</h1>
      <p>Signed in as {user.email}.</p>
      <Logout />
    </>
  );
}
