import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) {
    return redirect('/');
  } else {
    redirect('/dashboard/overview');
  }
}
