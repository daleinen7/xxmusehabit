'use client';
import React from 'react';
import Link from 'next/link';
import { UserAuth } from '../../../context/AuthContext';

const EditLogic = ({ pageUserId }) => {
  const { user, userProfile } = UserAuth();
  return (
    user &&
    userProfile &&
    pageUserId === user.uid && (
      <Link href={`/artist/${userProfile.url}/profile/edit`}>Edit Profile</Link>
    )
  );
};
export default EditLogic;
