'use client';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import PostCard from './components/PostCard';

const fakePosts = [
  {
    title: 'test',
    description: 'test',
    image: 'https://picsum.photos/seed/asdf/303/233',
    draft:
      'https://firebasestorage.googleapis.com/v0/b/musehabit.appspot.com/o/Ek8IJjXm6BeBRY4QFkwDRxrW0CW2%2F2024%2F0%2Fdraft--Nobdp8ldhS2JZfahTIr.mp3?alt=media&token=21cbd2f8-d2a8-403a-8622-64bd59471a83',
    format: 'mp3',
    poster: 'Ek8IJjXm6BeBRY4QFkwDRxrW0CW2',
    id: '-Nobdp8ldhS2JZfahTIr',
    category: 'Music',
    postedAt: 1705767296020,
  },
];
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
      {fakePosts.length > 0 ? (
        <ul>
          {fakePosts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet</p>
      )}
    </>
  );
}
