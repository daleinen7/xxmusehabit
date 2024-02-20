// Inside your Post component
import { useState, useEffect } from 'react';
import { ref, get, update, onValue } from 'firebase/database';
import { db } from '../../lib/firebase';
import { UserAuth } from '../context/AuthContext';
import Link from 'next/link';
import Modal from './Modal';
import icons from '@/lib/icons';

const FollowButton = ({ artistUid }) => {
  const { user } = UserAuth();
  const [showModal, setShowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    if (!user) {
      setShowModal(true);
      return;
    }

    const followingRef = ref(db, `followers/${user.uid}/${artistUid}`);

    // Check if the user is already following the artist
    const snapshot = await get(followingRef);

    if (snapshot.exists()) {
      setIsFollowing(true);
      handleUnfollow();
      return;
    }

    const followerRef = ref(db, `followers/${user.uid}`);
    update(followerRef, { [artistUid]: true });
    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    const followingRef = ref(db, `followers/${user.uid}/${artistUid}`);
    update(followingRef, { [artistUid]: false });
    setIsFollowing(false);
  };

  useEffect(() => {
    if (!user) return;

    const followingRef = ref(db, `followers/${user.uid}/${artistUid}`);

    const unsubscribe = onValue(followingRef, (snapshot) => {
      setIsFollowing(snapshot.exists());
    });

    return () => unsubscribe();
  }, [user, artistUid]);

  return (
    <div className="">
      <button
        className="btn btn-primary font-satoshi flex items-center"
        onClick={handleFollow}
      >
        {isFollowing ? (
          <>Following</>
        ) : (
          <>
            Follow <span className="text-lg ml-2">{icons.plus}</span>
          </>
        )}
      </button>
      <Modal
        toggleText="Close Modal"
        showModal={showModal}
        setShowModal={setShowModal}
      >
        {showModal && (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold">
              To follow an artist, create an account or log in
            </h3>
            <p className="text-lg">
              When you have a Musehabit account, you can share your own work and
              interact with others&apos; work.
            </p>
            <div className="flex gap-4 py-6">
              <Link href="/login" className="btn btn-secondary">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Create an Account
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FollowButton;
