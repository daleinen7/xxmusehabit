"use client";
import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { daysUntilNextPost } from "../../lib/daysUntilNextPost";
import navData from "../../lib/navData";
import Link from "next/link";

const NavItem = ({ url, func, text }) => (
  <li key={url} className="text-gray-400 hover:text-white">
    {url ? (
      <Link href={url}>{text}</Link>
    ) : (
      <button onClick={func}>{text}</button>
    )}
  </li>
);

const Nav = () => {
  const { user, userProfile, googleSignIn, logOut } = UserAuth();
  const [canUserPostState, setCanUserPostState] = useState(false);
  const [daysUntilNextPostState, setDaysUntilNextPostState] = useState(null);

  useEffect(() => {
    const checkUserPostability = async () => {
      try {
        const result = await daysUntilNextPost(user?.uid);
        setCanUserPostState(result.canPost);
        setDaysUntilNextPostState(result.daysUntilNextPost);
      } catch (error) {
        console.error("Error checking if user can post:", error);
        // Handle the error if necessary
      }
    };

    // Check user postability when the component mounts
    checkUserPostability();
  }, [user?.uid]);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  return (
    <nav className="p-4">
      <ul className="flex gap-6 items-center">
        <li>
          <Link href="/">
            <h1 className="text-xl">Musehabit</h1>
          </Link>
        </li>
        {navData.map((navItem) => {
          if (navItem.function === "handleSignIn") navItem.func = handleSignIn;
          if (navItem.function === "handleLogOut") navItem.func = handleLogOut;

          if (navItem.text === "Share") {
            if (canUserPostState) {
              return (
                <>
                  You have {daysUntilNextPostState} days left to post
                  <NavItem key={navItem.text} {...navItem} />
                </>
              );
            } else {
              return (
                <li key={navItem.url}>
                  Days until you can post: {daysUntilNextPost}
                </li>
              );
            }
          }

          if (
            navItem.auth === undefined ||
            (navItem.auth && user) ||
            (!navItem.auth && !user)
          ) {
            return <NavItem key={navItem.text} {...navItem} />;
          }

          return null;
        })}
      </ul>
    </nav>
  );
};
export default Nav;
