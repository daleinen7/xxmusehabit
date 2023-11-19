'use client';
import { signOut, useSession } from 'next-auth/react';

export default function Home() {
  const session = useSession();

  console.log(session);

  return (
    <div>
      {session.status === 'authenticated' ? (
        <div>
          <p>Signed in as {session.data.user.name}</p>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
