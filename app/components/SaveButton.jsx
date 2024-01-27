// Inside your Post component
import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { UserAuth } from '../context/AuthContext';
import icons from '@/lib/icons';
import Modal from './Modal';
import Link from 'next/link';

const SaveButton = ({ artistUid }) => {
  const { user } = UserAuth();
  const [showModal, setShowModal] = useState(false);

  const handleSave = async () => {
    if (!user) {
      // Handle the case when the user is not authenticated
      setShowModal(true);
      return;
    }

    const savedRef = ref(db, `saved/${user.uid}`);
    update(savedRef, { [postUid]: true });
  };

  return (
    <div className="">
      <button onClick={handleSave}>{icons.bookmark}</button>
      <Modal
        toggleText="Close Modal"
        showModal={showModal}
        setShowModal={setShowModal}
      >
        {showModal && (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold">
              To save a post, create an account or log in
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

export default SaveButton;
