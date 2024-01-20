'use client';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { user, userProfile } from './context/AuthContext';
import Post from './components/Post';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Reference to the 'posts' node in the database
    const postsRef = ref(db, 'posts');

    // Listen for changes in the data and update the state
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object of posts to an array
        const postsArray = Object.values(data);
        setPosts(postsArray);
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  return (
    <>
      <h2>Main Feed</h2>

      {user && <p>Hi {user.displayName}</p>}
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Post post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet</p>
      )}
    </>
  );
}
