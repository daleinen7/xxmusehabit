import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../../../lib/firebase";
import slugify from "../../../lib/slugify";

// Function to get posts for a specific user
export async function getPostsByUser(displayName) {
  try {
    // Create a reference to the 'users' collection
    const usersRef = ref(db, "users");

    // Use query to find the user with the specified username
    const userQuery = query(
      usersRef,
      orderByChild("displayName"),
      equalTo(displayName)
    );

    // Get the user snapshot
    const userSnapshot = await get(userQuery);

    // Check if the user exists
    if (userSnapshot.exists()) {
      // Get the user's ID from the snapshot
      const userId = Object.keys(userSnapshot.val())[0];

      // Create a reference to the user's posts
      const userPostsRef = ref(db, `users/${userId}/posts`);

      // Get the posts snapshot
      const postsSnapshot = await get(userPostsRef);

      // Return the posts data
      return postsSnapshot.val();
    } else {
      // User not found
      return " user not found";
    }
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
}

const ArtistFeed = ({ params }: { params: { displayName: string } }) => {
  const posts = getPostsByUser(slugify(params.displayName));

  console.log(posts);

  return (
    <>
      <h2>Artist Feed</h2>
      {/* <p>Display Name: {params.displayName}</p> */}
    </>
  );
};
export default ArtistFeed;
