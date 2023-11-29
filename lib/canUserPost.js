import { ref, get } from "firebase/database";
import { db } from "./firebase";

export async function canUserPost(userId) {
  const userRef = ref(db, `users/${userId}`);
  const userSnapshot = await get(userRef);
  // const userJoinedTimestamp = userSnapshot.val().joined;
  const latestPostTimestamp = userSnapshot.val()?.latestPost;
  const latestPostDate = new Date(latestPostTimestamp);
  // const userJoinedDayOfMonth = userJoinedDate.getDate();

  let canUserPost = false;

  // the user can post if:
  // 1. they have no posts
  if (!latestPostTimestamp) {
    canUserPost = true;
  }

  // 2. their most recent post was before the post date of the last month
  const lastMonth = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;

  // console.log("LATEST POST TIMESTAMP: ", latestPostTimestamp);
  // console.log("LAST MONTH: ", lastMonth);
  // console.log("EQUATION: ", latestPostTimestamp + " < " + lastMonth);

  // console.log(
  //   `latestPostTimestamp: ${latestPostTimestamp} < lastMonth: ${lastMonth}`
  // );

  // console.log("Result: ", latestPostTimestamp < lastMonth);

  if (latestPostTimestamp < lastMonth) {
    canUserPost = true;
  }

  return canUserPost;
}
