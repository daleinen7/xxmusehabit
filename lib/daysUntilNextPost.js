import { ref, get } from "firebase/database";
import { db } from "./firebase";

export async function daysUntilNextPost(userId) {
  const userRef = ref(db, `users/${userId}`);
  const userSnapshot = await get(userRef);

  if (!userSnapshot.exists()) {
    // Handle the case where the user doesn't exist
    return {
      canPost: false,
      daysUntilNextPost: null,
    };
  }

  const userJoinedTimestamp = userSnapshot.val().joined;
  const latestPostTimestamp = userSnapshot.val().latestPost;

  const currentDate = new Date();
  const userJoinedDate = new Date(userJoinedTimestamp);
  const latestPostDate = latestPostTimestamp
    ? new Date(latestPostTimestamp)
    : null;

  const userJoinedDayOfMonth = userJoinedDate.getDate();
  const currentDayOfMonth = currentDate.getDate();

  // Calculate the number of days until the user can post or has to post
  let daysUntilNextPost = null;
  let canPost = false;

  if (!latestPostTimestamp) {
    // User has no posts, calculate days until they have to post
    daysUntilNextPost = userJoinedDayOfMonth - currentDayOfMonth;
    canPost = daysUntilNextPost <= 0;
  } else {
    // User has posted before, calculate days until they can post again
    const daysSinceLastPost = Math.floor(
      (currentDate - latestPostDate) / (1000 * 60 * 60 * 24)
    );
    daysUntilNextPost = 30 - daysSinceLastPost;
    canPost = daysUntilNextPost <= 0;
  }

  return {
    canPost,
    daysUntilNextPost,
  };
}
