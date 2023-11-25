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
            });
          }
          // Get user profile
          onValue(userRef, (snapshot) => {
            setUserProfile(snapshot.val());
          });
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
