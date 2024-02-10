'use client';
import React, { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../../../../lib/firebase';
import Post from '../../../components/Post';

const PostPage = ({ params }) => {
  const { id } = params;
  const [postWithUserData, setPostWithUserData] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Reference to the specific post node in the database using the post ID
        const postRef = ref(db, `posts/${id}`);
        const postSnapshot = await get(postRef);
        const postData = postSnapshot.val();

        if (postData) {
          // Fetch user data for the poster
          const userRef = ref(db, `users/${postData.poster}`);
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.val();

          // Combine post data and user data
          const postWithUserData = {
            ...postData,
            posterData: userData,
          };
          setPostWithUserData(postWithUserData);
        } else {
          // Handle if the post is not found
          console.log('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();

    // Clean up function
    return () => {
      // Any cleanup needed
    };
  }, [id]); // Re-run effect when params.id changes

  console.log('postWithUserData:', postWithUserData);

  return (
    <div className="my-[2rem]">
      {postWithUserData && <Post post={postWithUserData} />}
    </div>
  );
};
export default PostPage;
