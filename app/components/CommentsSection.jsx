import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../../lib/firebase';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Reference to the comments for the current post
    const commentsRef = ref(db, `comments/${postId}`);

    // Listen for changes in the comments and update the state
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object of comments to an array
        const commentsArray = Object.values(data);
        setComments(commentsArray);
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Push the new comment to the Firebase db
    const commentData = {
      text: newComment,
      // Add other relevant data such as commenter's username, timestamp, etc.
    };
    push(ref(db, `comments/${postId}`), commentData);
    // Clear the input field after posting the comment
    setNewComment('');
  };

  return (
    <div className="comments-section mx-4 px-4 border-l-[1px] border-slate-200">
      <h3>Comments ({comments.length})</h3>
      <div className="comments-list">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p>{comment.text}</p>
            {/* Display other comment details */}
          </div>
        ))}
      </div>
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
    </div>
  );
};

export default CommentsSection;
