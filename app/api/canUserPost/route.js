import { differenceInDays, getDay, getMonth } from "date-fns";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { user } = req.query;

  try {
    if (!user || !user.createdAt) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const currentDate = new Date();
    const userSignupDate = new Date(user.createdAt); // Assuming user.createdAt is a string

    const hasPostedThisMonth = user.lastPostMonth === getMonth(currentDate);

    if (hasPostedThisMonth) {
      return res.json({ canPost: false });
    }

    const daysUntilSignupDate = differenceInDays(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        getDay(userSignupDate)
      ),
      currentDate
    );

    const canPost = daysUntilSignupDate <= 5; // Adjust the logic as needed

    return res.json({ canPost });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
