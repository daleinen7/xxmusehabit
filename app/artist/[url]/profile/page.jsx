import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../../../../lib/firebase';
import EditLogic from './EditLogic';

export async function generateStaticParams() {
  const usersRef = ref(db, 'users');

  const snapshot = await get(usersRef);

  const data = snapshot.val();

  return Object.values(data).map((profile) => ({
    params: { url: profile.url },
  }));
}

export default async function Profile({ params }) {
  const { url } = params;

  const usersRef = ref(db, 'users');
  const userQuery = query(usersRef, orderByChild('url'), equalTo(url));
  const snapshot = await get(userQuery);

  const data = snapshot.val();
  const profile = data[Object.keys(data)[0]];
  console.log('PROFILE: ', Object.keys(data)[0]);

  return (
    <>
      <h2>{profile.username}</h2>
      <EditLogic pageUserId={Object.keys(data)[0]} />
      <p>{profile.bio}</p>
    </>
  );
}
