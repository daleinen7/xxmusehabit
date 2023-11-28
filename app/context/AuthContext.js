'use client';
import { useContext, createContext, useState, useEffect } from 'react';
import {
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { ref, get, set, onValue, serverTimestamp } from 'firebase/database';
import { differenceInDays, addMonths, startOfMonth } from 'date-fns';

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
              bio: '',
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

            // Calculate canPost and daysUntilNextPost
            const latestPostDate = userData.latestPost
              ? new Date(userData.latestPost)
              : null;
            const today = new Date();

            // Calculate post date based on joined date
            const joinedDate = userData.joined
              ? new Date(userData.joined)
              : null;

            console.log('date joined: ', joinedDate);

            console.log('latest post date: ', latestPostDate);

            // if (!latestPostDate) {
            //   // User has never posted
            //   setCanPost(true);
            //   setDaysUntilNextPost(null);
            // } else {
            //   // User has posted before
            //   const daysSinceLastPost = differenceInDays(today, latestPostDate);

            //   if (today > postDate) {
            //     // It's past the post date, wait until the next month
            //     const nextPostDate = addMonths(postDate, 1);
            //     setCanPost(false);
            //     setDaysUntilNextPost(differenceInDays(nextPostDate, today));
            //   } else {
            //     // They can post up to the post date
            //     setCanPost(daysSinceLastPost >= 1);
            //     setDaysUntilNextPost(daysSinceLastPost);
            //   }
            // }
            setUserProfile(userData);
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
