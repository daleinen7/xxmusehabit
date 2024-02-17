'use client';
import { useEffect, useState } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../lib/firebase';
import Post from './components/Post';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Reference to the 'posts' node in the database
    const postsRef = ref(db, 'posts');

    // Listen for changes in the data and update the state
    const unsubscribe = onValue(postsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object of posts to an array
        const postsArray = Object.values(data);

        // Fetch user data for each post
        // TODO: do this more efficiently
        const postsWithUserData = await Promise.all(
          postsArray.map(async (post) => {
            // Fetch user data using the poster's ID
            const userRef = ref(db, `users/${post.poster}`);
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val();

            // Combine post data and user data
            return {
              ...post,
              posterData: userData,
            };
          })
        );

        setPosts(postsWithUserData);
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="flex flex-col max-w-[44rem] mt-16 gap-9 mb-9">
        <h2 className="font-hepta text-5xl font-bold text-center leading-[130%]">
          This is a tagline that summarizes Musehabit
        </h2>
        <p className="text-center text-2xl">
          This is a small description of Musehabit. It gives a little more
          detail about what users can do on the website.
        </p>
        <h3 className="font-satoshi text-4xl font-bold text-center">
          Global Feed
        </h3>
      </div>
      {posts.length > 0 ? (
        <ul className="width-wrapper w-full flex flex-col gap-32">
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
