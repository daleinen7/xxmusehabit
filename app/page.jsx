'use client';
import { useEffect, useState } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../lib/firebase';
import Modal from './components/Modal';
import Post from './components/Post';
import PostCard from './components/PostCard';

const fakePosts = [
  {
    title: 'Music Test',
    description: 'test',
    image: 'https://picsum.photos/seed/asddfghf/303/233',
    draft:
      'https://firebasestorage.googleapis.com/v0/b/musehabit.appspot.com/o/Ek8IJjXm6BeBRY4QFkwDRxrW0CW2%2F2024%2F0%2Fdraft--Nobdp8ldhS2JZfahTIr.mp3?alt=media&token=21cbd2f8-d2a8-403a-8622-64bd59471a83',
    format: 'mp3',
    poster: 'Ek8IJjXm6BeBRY4QFkwDRxrW0CW2',
    id: '-Nobdp8ldhqwerS2JZfahTIr',
    category: 'Music',
    postedAt: 1705767296020,
    posterData: {
      bio: 'whatever',
      joined: 1705767196132,
      location: 'Chicago, IL',
      photoUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocIJOgEaAoKZpg2tTmh7oa0N9aoGmWrdqfppz0ipYuU5-sw=s96-c',

      medium: 'work work work work',
      url: 'doug',
      username: 'doug',
    },
    toolsUsed: ['what?'],
    tags: ['happy', 'sad', 'whatever', 'more whatever', 'sewing'],
  },
  {
    title: 'Video Test',
    description: 'test',
    image: 'https://picsum.photos/seed/asddfgyf/303/233',
    draft:
      'https://firebasestorage.googleapis.com/v0/b/musehabit.appspot.com/o/Lech%20Piercha%C5%82a%2019281032%20video.mp4?alt=media&token=ded983c8-5215-45ba-9084-460b23b445a6',
    format: 'mp4',
    poster: 'Ek8IJjXm6BeBRY4QFkwDRxrW0CW2',
    id: '-Nobdp8ldasdfhS2JZfahTIr',
    category: 'Music',
    postedAt: 1705767296020,
    posterData: {
      bio: 'whatever',
      joined: 1705767196132,
      location: 'Chicago',
      photoUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocIJOgEaAoKZpg2tTmh7oa0N9aoGmWrdqfppz0ipYuU5-sw=s96-c',

      medium: 'work work work work',
      url: 'doug',
      username: 'doug',
    },
    toolsUsed: ['photoshop bourbon and an omni-chord'],
    tags: ['happy', 'sad', 'whatever', 'more whatever', 'sewing'],
  },
  {
    title: 'Photo Test',
    description: 'test',
    image: 'https://picsum.photos/seed/asdudftyf/303/233',
    draft: 'https://picsum.photos/seed/whatever/303/233',
    format: 'mp4',
    poster: 'Ek8IJjXm6BeBRY4QFkwDRxrW0CW2',
    id: '-Nobdp8ldhS2asdfJZfahTIr',
    category: 'Music',
    postedAt: 1705767296020,
    posterData: {
      bio: 'whatever',
      joined: 1705767196132,
      location: 'Chicago',
      photoUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocIJOgEaAoKZpg2tTmh7oa0N9aoGmWrdqfppz0ipYuU5-sw=s96-c',

      medium: 'work work work work',
      url: 'doug',
      username: 'doug',
    },
    toolsUsed: ['photoshop bourbon and an omni-chord'],
    tags: ['happy', 'sad', 'whatever', 'more whatever', 'sewing'],
  },
  {
    title: 'Text Test',
    description: 'test',
    image: 'https://picsum.photos/seed/asd12345f/303/233',
    draft:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    format: 'mp4',
    poster: 'Ek8IJjXm6BeBRY4QFkwDRxrW0CW2',
    id: '-Nobdp8ldhS2JZfasdfhTIr',
    category: 'Music',
    postedAt: 1705767296020,
    posterData: {
      bio: 'whatever',
      joined: 1705767196132,
      location: 'Chicago',
      photoUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocIJOgEaAoKZpg2tTmh7oa0N9aoGmWrdqfppz0ipYuU5-sw=s96-c',

      medium: 'work work work work',
      url: 'doug',
      username: 'doug',
    },
    toolsUsed: ['photoshop bourbon and an omni-chord'],
    tags: ['happy', 'sad', 'whatever', 'more whatever', 'sewing'],
  },
  {
    title: 'Video Test',
    description: 'test',
    image: 'https://picsum.photos/seed/asds5drf/303/233',
    draft:
      'https://firebasestorage.googleapis.com/v0/b/musehabit.appspot.com/o/Lech%20Piercha%C5%82a%2019281032%20video.mp4?alt=media&token=ded983c8-5215-45ba-9084-460b23b445a6',
    format: 'mp4',
    poster: 'Ek8IJjXm6BeBRY4QFkwDRxrW0CW2',
    id: '-Nobdasfdp8ldhS2JZfahTIr',
    category: 'Music',
    postedAt: 1705767296020,
    posterData: {
      bio: 'whatever',
      joined: 1705767196132,
      location: 'Chicago',
      photoUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocIJOgEaAoKZpg2tTmh7oa0N9aoGmWrdqfppz0ipYuU5-sw=s96-c',

      medium: 'work work work work',
      url: 'doug',
      username: 'doug',
    },
    toolsUsed: ['photoshop bourbon and an omni-chord'],
    tags: ['happy', 'sad', 'whatever', 'more whatever', 'sewing'],
  },
  {
    title: 'Music Test',
    description: 'test',
    image: 'https://picsum.photos/seed/assdr6df/303/233',
    draft:
      'https://firebasestorage.googleapis.com/v0/b/musehabit.appspot.com/o/Ek8IJjXm6BeBRY4QFkwDRxrW0CW2%2F2024%2F0%2Fdraft--Nobdp8ldhS2JZfahTIr.mp3?alt=media&token=21cbd2f8-d2a8-403a-8622-64bd59471a83',
    format: 'mp3',
    poster: 'Ek8IJjXm6BeBRY4QFkwDRxrW0CW2',
    id: '-Nobdp8ldhasdfS2JZfahTIr',
    category: 'Music',
    postedAt: 1705767296020,
    posterData: {
      bio: 'whatever',
      joined: 1705767196132,
      location: 'Chicago',
      photoUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocIJOgEaAoKZpg2tTmh7oa0N9aoGmWrdqfppz0ipYuU5-sw=s96-c',

      medium: 'work work work work',
      url: 'doug',
      username: 'doug',
    },
    toolsUsed: ['photoshop bourbon and an omni-chord'],
    tags: ['happy', 'sad', 'whatever', 'more whatever', 'sewing'],
  },
  {
    title: 'Text Test',
    description: 'test',
    image: 'https://picsum.photos/seed/asdsder67t5f/303/233',
    draft:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    format: 'mp4',
    poster: 'Ek8IJjXm6BeBRY4QFkwDRxrW0CW2',
    id: '-Nobdp8ldasdfasdfasdfasdfasdfhS2JZfahTIr',
    category: 'Music',
    postedAt: 1705767296020,
    posterData: {
      bio: 'whatever',
      joined: 1705767196132,
      location: 'Chicago',
      photoUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocIJOgEaAoKZpg2tTmh7oa0N9aoGmWrdqfppz0ipYuU5-sw=s96-c',

      medium: 'work work work work',
      url: 'doug',
      username: 'doug',
    },
    toolsUsed: ['photoshop bourbon and an omni-chord'],
    tags: ['happy', 'sad', 'whatever', 'more whatever', 'sewing'],
  },
  {
    title: 'Photo Test',
    description: 'test',
    image: 'https://picsum.photos/seed/asdf/303/233',
    draft: 'https://picsum.photos/seed/whatever/303/233',
    format: 'mp4',
    poster: 'Ek8IJjXm6BeBRY4QFkwDRxrW0CW2',
    id: '-Nobdp8ldhS2JasdfZfahTIr',
    category: 'Music',
    postedAt: 1705767296020,
    posterData: {
      bio: 'whatever',
      joined: 1705767196132,
      location: 'Chicago',
      photoUrl:
        'https://lh3.googleusercontent.com/a/ACg8ocIJOgEaAoKZpg2tTmh7oa0N9aoGmWrdqfppz0ipYuU5-sw=s96-c',

      medium: 'work work work work',
      url: 'doug',
      username: 'doug',
    },
    toolsUsed: ['photoshop bourbon and an omni-chord'],
    tags: ['happy', 'sad', 'whatever', 'more whatever', 'sewing'],
  },
];

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
      <Modal
        toggleText="Close Modal"
        showModal={showModal}
        setShowModal={setShowModal}
      >
        <Post post={showModal} />
      </Modal>
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
      {fakePosts.length > 0 ? (
        <ul className="width-wrapper w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {fakePosts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} setShowModal={setShowModal} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet</p>
      )}
    </>
  );
}
