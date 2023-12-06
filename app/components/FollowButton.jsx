// Inside your Post component
import { ref, update } from "firebase/database";
import { db } from "../../lib/firebase";
import { UserAuth } from "../context/AuthContext";

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

  return <button onClick={handleFollow}>Follow</button>;
};

export default FollowButton;
