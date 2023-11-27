import { ref, get } from "firebase/database";
import { db } from "./firebase";

export async function canUserPost(userId) {
  const userRef = ref(db, `users/${userId}`);
  const userSnapshot = await get(userRef);
  const userJoinedTimestamp = userSnapshot.val().joined;
  const latestPostTimestamp = userSnapshot.val().latestPost;
  const latestPostDate = new Date(latestPostTimestamp);
  // const userJoinedDayOfMonth = userJoinedDate.getDate();

  let canUserPost = false;

  // the user can post if:
  // 1. they have no posts
  if (!latestPostTimestamp) {
    console.log("NO POSTS");
    canUserPost = true;
  }

  // 2. their most recent post was before the post date of the last month
  const lastMonth = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;

  console.log("LATEST POST TIMESTAMP: ", latestPostTimestamp);
  console.log("LAST MONTH: ", lastMonth);
  console.log("EQUATION: ", latestPostTimestamp + " < " + lastMonth);

  if (latestPostTimestamp < lastMonth) {
    console.log("LAST POST WAS BEFORE LAST MONTH");
    canUserPost = true;
  }

  // // 3. their most recent post was before they joined
  // if (latestPostTimestamp < userJoinedTimestamp) {
  //   canUserPost = true;
  // }

  console.log("CAN USER POST: ", canUserPost);

  return canUserPost;
}
