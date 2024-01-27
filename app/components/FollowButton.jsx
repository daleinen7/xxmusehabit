// Inside your Post component
import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { UserAuth } from '../context/AuthContext';
import Link from 'next/link';
import Modal from './Modal';
import icons from '@/lib/icons';

const FollowButton = ({ artistUid }) => {
  const { user } = UserAuth();
  const [showModal, setShowModal] = useState(false);

  const handleFollow = async () => {
    if (!user) {
      // Handle the case when the user is not authenticated
      setShowModal(true);
      return;
    }

    const followersRef = ref(db, `followers/${user.uid}`);
    update(followersRef, { [artistUid]: true });
  };

  return (
    <div className="">
      <button
        className="font-satoshi flex items-center rounded bg-slate-300 py-2 px-4 font-medium"
        onClick={handleFollow}
      >
        Follow <span className="text-lg ml-2">{icons.plus}</span>
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
