'use client';
import React from 'react';
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';

const PostNotification = () => {
  const { user, canPost, daysUntilNextPost } = UserAuth();
  return user ? (
    <div className="width-wrapper text-sm">
      {canPost ? (
        <div className="flex justify-between border rounded items-center my-8 py-2 px-6">
          {daysUntilNextPost >= 1 ? (
            <div>It&apos;s your day to post!</div>
          ) : (
            <div>{daysUntilNextPost} days until post is due</div>
          )}
          <Link className="btn btn-primary" href="/share">
            Share
          </Link>
        </div>
      ) : (
        <div>Can post again in {daysUntilNextPost} days</div>
      )}
    </div>
  ) : null;
};
export default PostNotification;
