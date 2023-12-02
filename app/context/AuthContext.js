"use client";
import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { ref, get, set, onValue, serverTimestamp } from "firebase/database";
import differenceInDays from "date-fns/differenceInDays";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [canPost, setCanPost] = useState(false);
  const [daysUntilNextPost, setDaysUntilNextPost] = useState(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Check for user profile and create one if it doesn't exist
      if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        get(userRef).then((snapshot) => {
          if (!snapshot.exists()) {
            // User profile doesn't exist, create a new one
            set(userRef, {
              username: currentUser.displayName,
              bio: "",
              photoURL: currentUser.photoURL,
              joined: serverTimestamp(),
              settings: {
                dayBeforeNotification: true,
                weekBeforeNotification: true,
                tenDaysBeforeNotification: true,
                accountabilityNotice: true,
              },
              zipcode: false,
              latestPost: false,
            });
          }

          onValue(userRef, (snapshot) => {
            const userData = snapshot.val();

            // console.log("userData: ", userData);

            // console.log("latest post date: ", new Date(userData.latestPost));

            // Calculate daysUntilNextPost
            // get user start date
            const userStartDate = new Date(userData.joined).getDate();
            // console.log("userStartDate: ", userStartDate);
            // get latest post day
            const latestPostDay = new Date(userData.latestPost).getDate();
            // console.log("latestPost: ", latestPostDay);
            // get latest post month
            const latestPostMonth = new Date(userData.latestPost).getMonth();
            // console.log("latestPostMonth: ", latestPostMonth);
            // get today's date
            const todaysDate = new Date().getDate();
            // console.log("today: ", todaysDate);
            // get today's month
            const todaysMonth = new Date().getMonth();
            // console.log("todayMonth: ", todaysMonth);

            // if userData.latestPost is false, then canPost is true
            if (!userData.latestPost) {
              setCanPost(true);
            }

            let nextPostDate;

            if (latestPostMonth < todaysMonth) {
              // set nextPostDate to this month on the post date
              // console.log("POST IS THIS MONTH!!!!!!");
              nextPostDate = new Date(
                new Date().getFullYear(),
                todaysMonth,
                userStartDate
              );
            } else {
              // set nextPostDate to next month on the post date
              // console.log("Post is next month. Got plenty of time .... ");
              nextPostDate = new Date(
                new Date().getFullYear(),
                todaysMonth + 1,
                userStartDate
              );
            }

            // console.log("nextPostDate: ", nextPostDate);

            setDaysUntilNextPost(differenceInDays(nextPostDate, new Date()));

            setUserProfile(userData);
          });
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

  // console.log("canPost: ", canPost);
  // console.log("daysUntilNextPost: ", daysUntilNextPost);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        canPost,
        daysUntilNextPost,
        googleSignIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
