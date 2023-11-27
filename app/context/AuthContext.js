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
          // Get user profile
          onValue(userRef, (snapshot) => {
            setUserProfile(snapshot.val());

            // Calculate canPost and daysUntilNextPost
            const latestPostDate = userData.latestPost
              ? new Date(userData.latestPost)
              : null;
            const today = new Date();
            console.log("LATEST POST DATE: ", latestPostDate);
            console.log("TODAY: ", today);
            const daysSinceLastPost = latestPostDate
              ? differenceInDays(today, latestPostDate)
              : null;
            const daysUntilNext = userData.joined
              ? differenceInDays(addDays(today, 1), userData.joined)
              : null;

            // Update state
            setCanPost(!latestPostDate || daysSinceLastPost >= 1);
            setDaysUntilNextPost(daysUntilNext);
          });
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

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
