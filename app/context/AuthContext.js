'use client';
import { useContext, createContext, useState, useEffect } from 'react';
import {
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import {
  ref,
  get,
  set,
  update,
  onValue,
  serverTimestamp,
} from 'firebase/database';
import slugify from '../../lib/slugify';
import differenceInDays from 'date-fns/differenceInDays';

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

  const passwordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  };

  const emailSignIn = async (email, password) => {
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      // Rest of your code...
    } catch (error) {
      console.error('Error signing in with email and password:', error);
    }
  };

  const emailSignUp = async (email, password, displayName) => {
    try {
      console.log('SIGNT UP');
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });

      setUser(userCredential.user);

      const userRef = ref(db, `users/${userCredential.user.uid}`);

      // User profile doesn't exist, create a new one
      await set(userRef, {
        username: userCredential.user.displayName,
        url:
          userCredential.user.displayName &&
          slugify(userCredential.user.displayName),
        bio: '',
        medium: '',
        photoURL: userCredential.user.photoURL,
        joined: serverTimestamp(),
        settings: {
          dayBeforeNotification: true,
          weekBeforeNotification: true,
          tenDaysBeforeNotification: true,
          accountabilityNotice: true,
        },
        location: false,
        latestPost: false,
      });
    } catch (error) {
      console.error('Error signing up with email and password:', error);
    }
  };

  const updateUserProfile = async (profileInfo) => {
    console.log('Update user profile function: ', profileInfo);
    try {
      await updateProfile(user, {
        displayName: profileInfo.displayName,
        photoURL: profileInfo.profileImageUrl,
      });

      const userRef = ref(db, `users/${user.uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          // User profile doesn't exist, create a new one
          set(userRef, {
            username: profileInfo.displayName,
            url: slugify(profileInfo.displayName),
            bio: profileInfo.bio,
            medium: profileInfo.medium,
            settings: {
              dayBeforeNotification: true,
              weekBeforeNotification: true,
              tenDaysBeforeNotification: true,
              accountabilityNotice: true,
            },
            location: profileInfo.location,
          });
        }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Calling unsubscribe: ', currentUser);
      setUser(currentUser);
      // Check for user profile and create one if it doesn't exist
      if (currentUser) {
        console.log('UNSUBSCRIBE USER : ', currentUser);
        const userRef = ref(db, `users/${currentUser.uid}`);
        get(userRef).then((snapshot) => {
          // if (!snapshot.exists()) {
          //   console.log('THERE IS NO USER PROFILE');
          //   // User profile doesn't exist, create a new one
          //   update(userRef, {
          //     username: currentUser.displayName,
          //     url: currentUser.displayName && slugify(currentUser.displayName),
          //     bio: '',
          //     medium: '',
          //     photoURL: currentUser.photoURL,
          //     // joined: serverTimestamp(),
          //     settings: {
          //       dayBeforeNotification: true,
          //       weekBeforeNotification: true,
          //       tenDaysBeforeNotification: true,
          //       accountabilityNotice: true,
          //     },
          //     // location: false,
          //     // latestPost: false,
          //   });
          // }

          onValue(userRef, (snapshot) => {
            const userData = snapshot.val();

            if (userData) {
              // Calculate daysUntilNextPost
              // get user start date
              const userStartDate = new Date(userData.joined).getDate();

              // get latest post day
              const latestPostDay = new Date(userData.latestPost).getDate();

              // get latest post month
              const latestPostMonth = new Date(userData.latestPost).getMonth();

              // get today's date
              const todaysDate = new Date().getDate();

              // get today's month
              const todaysMonth = new Date().getMonth();

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

              // console.log('userData: ', userData);
              // console.log('latest post date: ', new Date(userData.latestPost));
              // console.log('userStartDate: ', userStartDate);
              // console.log('latestPost: ', latestPostDay);
              // console.log('latestPostMonth: ', latestPostMonth);
              // console.log('today: ', todaysDate);
              // console.log('todayMonth: ', todaysMonth);
              // console.log('nextPostDate: ', nextPostDate);

              setDaysUntilNextPost(differenceInDays(nextPostDate, new Date()));

              setUserProfile(userData);
            }
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
        updateUserProfile,
        passwordReset,
        emailSignUp,
        emailSignIn,
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
