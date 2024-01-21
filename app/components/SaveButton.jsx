// Inside your Post component
import { ref, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { UserAuth } from '../context/AuthContext';
import icons from '@/lib/icons';

const SaveButton = ({ artistUid }) => {
  const { user } = UserAuth();

  const handleSave = async () => {
    if (!user) {
      // Handle the case when the user is not authenticated
      return;
    }

    const savedRef = ref(db, `saved/${user.uid}`);
    update(savedRef, { [postUid]: true });
  };

  return <button onClick={handleSave}>{icons.bookmark}</button>;
};

export default SaveButton;
