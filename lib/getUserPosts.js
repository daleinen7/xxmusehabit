import { ref, get, child } from "firebase/database";
import { db } from "./firebase";

const getUserPosts = async (uid) => {
  try {
    const userPostsRef = child(ref(db), `posts`);
    const userPostsSnapshot = await get(userPostsRef);

    if (userPostsSnapshot.exists()) {
      const userPostsData = userPostsSnapshot.val();

      // Filter posts based on user UID
      const userPosts = Object.values(userPostsData).filter(
        (post) => post.userId === uid
      );

      return userPosts;
    } else {
      // Handle the case when the user has no posts
      return [];
    }
  } catch (error) {
    // Handle errors, e.g., log the error or show a message to the user
    console.error("Error fetching user posts:", error.message);
    return [];
  }
};

export default getUserPosts;
