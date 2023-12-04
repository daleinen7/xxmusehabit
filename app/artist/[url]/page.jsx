"use client";
import { ref, get, equalTo, orderByChild, query } from "firebase/database";
import { db } from "../../../lib/firebase";
import { useState, useEffect } from "react";
import Post from "../../../app/components/Post";

export async function getPostsByUser(url) {
  try {
    // Create a reference to the 'users' collection
    const usersRef = ref(db, "users");

    // Use query to find the user with the specified username
    const userQuery = query(usersRef, orderByChild("url"), equalTo(url));

    // Get the user snapshot
    const userSnapshot = await get(userQuery);

    // Check if the user exists
    if (userSnapshot.exists()) {
      // Get the user's ID from the snapshot
      const poster = Object.keys(userSnapshot.val())[0];

      // Create a reference to the user's posts
      const userPostsRef = ref(db, `posts`);

      // Use query to find posts for the user
      const postsQuery = query(
        userPostsRef,
        orderByChild("poster"),
        equalTo(poster)
      );

      // Get the posts snapshot
      const postsSnapshot = await get(postsQuery);

      // Return the posts data
      // return postsSnapshot.val();

      // Extract the posts data
      const postsData = postsSnapshot.val();

      // Check if there are posts
      if (postsData) {
        // Convert the postsData object to an array
        const postsArray = Object.keys(postsData).map((postId) => ({
          id: postId,
          details: postsData[postId],
        }));

        // Sort the array based on the "postedAt" property
        postsArray.sort((a, b) =>
          a.details.postedAt > b.details.postedAt ? -1 : 1
        );

        return { poster: userSnapshot.val()[poster], postsArray };
      }
    } else {
      // User not found
      return "user not found";
    }
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
}

const ArtistFeed = ({ params }) => {
  const [posts, setPosts] = useState([]);
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await getPostsByUser(params.url);
      setPosts(posts.postsArray);
      setPoster(posts.poster);
      setLoading(false);
    }
    fetchPosts();
  }, [params.url]);

  console.log("posts", posts);
  console.log("poster", poster);

  return loading ? (
    <p>Loading...</p>
  ) : (
    <>
      <h2>Artist Feed</h2>
      <p>{poster.username}</p>
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
