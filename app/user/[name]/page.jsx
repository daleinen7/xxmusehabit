"use client";
import { useEffect, useState } from "react";
import getUserPosts from "../../lib/getUserPosts";
import Post from "./Post"; // Assuming you have a Post component

const UserPosts = ({ uid }) => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const posts = await getUserPosts(uid);
      setUserPosts(posts);
    };

    fetchUserPosts();
  }, [uid]);

  return (
    <div>
      <h2>User Posts</h2>
      {userPosts.length > 0 ? (
        <div>
          {userPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>No posts available for this user.</p>
      )}
    </div>
  );
};

export default UserPosts;
