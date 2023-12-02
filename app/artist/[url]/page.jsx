'use client';
import { ref, get, equalTo, orderByChild, query } from 'firebase/database';
import { db } from '../../../lib/firebase';
import { useState, useEffect } from 'react';
import Post from '../../../app/components/Post';

export async function getPostsByUser(url) {
  try {
    const usersRef = ref(db, 'users');

    const userQuery = query(usersRef, orderByChild('url'), equalTo(url));

    const userSnapshot = await get(userQuery);

    if (userSnapshot.exists()) {
      const poster = Object.keys(userSnapshot.val())[0];

      const userPostsRef = ref(db, `posts`);

      const postsQuery = query(
        userPostsRef,
        orderByChild('poster'),
        equalTo(poster),
      );

      const postsSnapshot = await get(postsQuery);

      const postsData = postsSnapshot.val();

      if (postsData) {
        // Convert the postsData object to an array
        const postsArray = Object.keys(postsData).map((postId) => ({
          id: postId,
          details: postsData[postId],
        }));

        postsArray.sort((a, b) =>
          a.details.postedAt > b.details.postedAt ? -1 : 1,
        );

        return postsArray;
      }
    } else {
      return 'user not found';
    }
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error;
  }
}

const ArtistFeed = ({ params }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await getPostsByUser(params.url);
      setPosts(posts);
    }
    fetchPosts();
  }, [params.url]);

  console.log('posts', posts);

  return (
    <>
      <h2>Artist Feed</h2>
      <p>Display Name: {params.url}</p>
      <div>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.details.id} post={post.details} />
          ))
        ) : (
          <p>No posts found for this artist.</p>
        )}
      </div>
    </>
  );
};

export default ArtistFeed;
