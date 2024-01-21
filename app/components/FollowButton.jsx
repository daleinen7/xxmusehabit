// Inside your Post component
import { ref, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { UserAuth } from '../context/AuthContext';
import icons from '@/lib/icons';

const FollowButton = ({ artistUid }) => {
  const { user } = UserAuth();

  const handleFollow = async () => {
    if (!user) {
      // Handle the case when the user is not authenticated
      return;
    }

    const followersRef = ref(db, `followers/${user.uid}`);
    update(followersRef, { [artistUid]: true });
  };

  return (
    <button
      className="font-satoshi flex items-center rounded bg-slate-300 py-2 px-4 font-medium"
      onClick={handleFollow}
    >
      Follow <span className="text-lg ml-2">{icons.plus}</span>
    </button>
  );
};

export default FollowButton;
