import React, { useState, useEffect } from 'react';
import { ref, onValue, push, child } from 'firebase/database';
import Image from 'next/image';
import { db } from '../../lib/firebase';
import { UserAuth } from '../context/AuthContext';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const { user } = UserAuth();

  useEffect(() => {
    const commentsRef = ref(db, `comments/${postId}`);
    const usersRef = ref(db, 'users');

    const unsubscribe = onValue(
      commentsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const commentsArray = Object.values(data);
          const promises = [];

          for (const comment of commentsArray) {
            const posterId = comment.posterId;
            const promise = new Promise((resolve, reject) => {
              onValue(
                child(usersRef, posterId),
                (userSnapshot) => {
                  if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    const commentWithUserData = { ...comment, userData };
                    resolve(commentWithUserData);
                  } else {
                    // Handle case where user data doesn't exist
                    const commentWithNullUserData = {
                      ...comment,
                      userData: null,
                    };
                    resolve(commentWithNullUserData);
                  }
                },
                (error) => reject(error)
              );
            });
            promises.push(promise);
          }

          Promise.all(promises)
            .then((commentsWithUserData) => {
              setComments(commentsWithUserData);
            })
            .catch((error) => {
              console.error('Error fetching comments with user data:', error);
            });
        }
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Push the new comment to the Firebase db
    const commentData = {
      text: newComment,
      posterId: user.uid,

      // Add other relevant data such as commenter's username, timestamp, etc.
    };
    push(ref(db, `comments/${postId}`), commentData);
    // Clear the input field after posting the comment
    setNewComment('');
  };

  console.log('comments:', comments);

  return (
    <div className="comments-section mx-4 px-4 border-l-[1px] border-slate-200">
      <h3>Comments ({comments.length})</h3>
      <div className="flex flex-col">
        {comments.map((comment, index) => (
          <div key={index} className="flex">
            <Image
              src={comment.userData?.photoURL}
              alt={comment.userData?.username}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <h4>{comment.userData.username}</h4>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
      {user && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            className="p-2 w-full border border-slate-200 rounded-md mt-2 mb-4"
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button className="btn btn-primary" type="submit">
            Post Comment
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentsSection;
