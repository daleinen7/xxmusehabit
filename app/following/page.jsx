"use client";
import { useState, useEffect } from "react";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../../lib/firebase";
import { UserAuth } from "../context/AuthContext";
import Post from "../components/Post";

export async function getPostsByFollowing(userUid) {
  try {
    // Create a reference to the 'followers' collection
    const followersRef = ref(db, `followers/${userUid}`);

    // Get the followers snapshot
    const followersSnapshot = await get(followersRef);

    console.log("FOLLOW: ", followersSnapshot.val());

    // Check if the user is following anyone
    if (followersSnapshot.exists()) {
      // Get the list of followed artists
      const followedArtists = Object.keys(followersSnapshot.val());

      // Create a reference to the 'posts' collection
      const postsRef = ref(db, "posts");

      // Use query to find posts for the followed artists
      const postsQuery = query(postsRef, orderByChild("poster"));

      // Create an array of individual queries for each followed artist
      const individualQueries = followedArtists.map((artistUid) =>
        equalTo(artistUid)
      );

      // Apply the individual queries to the compound query
      const compoundQuery = individualQueries.reduce(
        (compoundQuery, individualQuery) =>
          query(compoundQuery, individualQuery),
        postsQuery
      );

      // Get the posts snapshot
      const postsSnapshot = await get(compoundQuery);

      console.log("POSTS: ", postsSnapshot.val());

      // Convert the postsData object to an array
      const postsArray = Object.entries(postsSnapshot.val()).map(
        ([postId, postDetails]) => postDetails
      );

      // Sort the array based on the "postedAt" property
      postsArray.sort((a, b) => (a.postedAt > b.postedAt ? -1 : 1));

      // Return the posts data as an array
      return postsArray;
    }
  } catch (error) {
    console.error("Error getting posts by following:", error);
    throw error;
  }
}

const FollowingPage = () => {
  const [posts, setPosts] = useState([]);
  const { user } = UserAuth();

  useEffect(() => {
    async function fetchPosts() {
      const userUid = user.uid; // replace with the actual user UID
      const posts = await getPostsByFollowing(userUid);
      console.log("POSTS: ", posts);
      setPosts(posts);
    }
    if (user && user.uid) fetchPosts();
  }, [user]);

  return (
    <>
      <h2>Following Feed</h2>
      <div>
        {posts && posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <p>No posts found from artists you&apos;re following.</p>
        )}
      </div>
    </>
  );
};

export default FollowingPage;
