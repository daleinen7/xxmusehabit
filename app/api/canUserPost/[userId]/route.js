import { NextRequest, NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { db } from "../../../../lib/firebase";

export async function GET(request, { params }) {
  const { userId } = params;

  const userRef = ref(db, `users/${userId}`);
  const userSnapshot = await get(userRef);
  const userJoinedTimestamp = userSnapshot.val().joined;
  const latestPostTimestamp = userSnapshot.val().latestPost;
  const userJoinedDate = new Date(userJoinedTimestamp);
  const latestPostDate = new Date(latestPostTimestamp);
  const userJoinedDayOfMonth = userJoinedDate.getDate();

  console.log("JOIN DATE: ", userJoinedDayOfMonth);
  console.log("LATEST POST DATE: ", latestPostDate);

  let canUserPost = false;

  // the user can post if:
  // 1. they have no posts
  if (!latestPostTimestamp) {
    canUserPost = true;
  }

  // 2. their most recent post was before the post date of the last month

  const json = {
    canUserPost,
  };

  return NextResponse.json(json);
}
