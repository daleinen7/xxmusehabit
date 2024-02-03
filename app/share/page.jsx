'use client';
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { ref, push, update, child, serverTimestamp } from 'firebase/database';
import { storage, db } from '../../lib/firebase';
import uploadFileToStorage from '../../lib/uploadFileToStorage';
import { daysUntilNextPost } from '../../lib/daysUntilNextPost';

const fileForm = [
  {
    label: 'Title of your Submission',
    input: 'title',
    type: 'text',
    required: true,
  },
  {
    label: "Description - tell us about what you've been working on!",
    input: 'description',
    type: 'textarea',
    required: true,
  },
  { label: 'Preview Image', input: 'image', type: 'file', required: true },
  { label: 'Draft', input: 'draft', type: 'file', required: true },
  { label: 'Tags', input: 'tags', type: 'text', required: true },
];

const writeForm = [
  {
    label: 'Title of your Submission',
    input: 'title',
    type: 'text',
    required: true,
  },
  { label: 'Preview Image', input: 'image', type: 'file', required: true },
  {
    label: 'Share a short writing example!',
    input: 'post',
    type: 'textarea',
    required: true,
  },
];

const allowedFileFormats = ['png', 'jpg', 'jpeg', 'pdf', 'mp3', 'mp4', 'gif'];

const Share = () => {
  const { register, handleSubmit, errors } = useForm();
  const [shared, setShared] = useState(false);
  const [postType, setPostType] = useState(null);

  const { user } = UserAuth();

  const onSubmit = async (data) => {
    const { title, description, image, draft, category, tags } = data;

    // check if draft is allowed file format
    const draftFileFormat = draft[0].name.split('.').pop();
    if (!allowedFileFormats.includes(draftFileFormat)) {
      console.error('Draft file format not allowed');
      alert('Draft file format not allowed');
      return;
    }

    const { canPost } = await daysUntilNextPost(user.uid);

    // check if user is allowed to post
    if (!canPost) {
      console.error('User not allowed to post');
      alert('User not allowed to post');
      return;
    }

    const imageFile = image[0];
    const draftFile = draft[0];

    // Generate a unique key for the new post
    const newPostKey = push(child(ref(db), 'posts')).key;

    const today = new Date();

    const imageFileName = `${
      user.uid
    }/${today.getFullYear()}/${today.getMonth()}/cover-image-${newPostKey}.${imageFile.name
      .split('.')
      .pop()}`;
    const imageFileUrl = await uploadFileToStorage(
      storage,
      imageFileName,
      imageFile
    );

    const draftFileName = `${
      user.uid
    }/${today.getFullYear()}/${today.getMonth()}/draft-${newPostKey}.${draftFile.name
      .split('.')
      .pop()}`;
    const draftFileUrl = await uploadFileToStorage(
      storage,
      draftFileName,
      draftFile
    );

    const newPost = {
      id: newPostKey,
      title,
      description,
      category,
      tags,
      image: imageFileUrl,
      draft: draftFileUrl,
      format: draftFile.name.split('.').pop(),
      poster: user.uid,
      postedAt: serverTimestamp(),
    };

    // Write the new post's data in the posts list
    const updates = {};
    updates['/posts/' + newPostKey] = newPost;

    // Update the user's posts list with the new post ID
    updates[`/users/${user.uid}/posts/${newPostKey}`] = true;

    // update Users latest post date
    updates[`/users/${user.uid}/latestPost`] = serverTimestamp();

    setShared(true);

    return update(ref(db), updates);
  };

  // if no posts
  if (shared === true) return <p>Thanks for sharing the post</p>;

  return (
    <>
      <h2>Share</h2>
      {postType === null ? (
        <div>
          <button onClick={() => setPostType('text')}>Text</button>
          <button onClick={() => setPostType('file')}>File</button>
        </div>
      ) : postType === 'text' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          {writeForm.map((formInput) => {
            return (
              <ShareInput
                key={formInput.label}
                formInput={formInput}
                register={register}
              />
            );
          })}

          <input
            type="submit"
            value="Submit"
            className="border-gray-400 p-4 border-2 rounded hover:border-white"
          />
        </form>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          {fileForm.map((formInput) => {
            return (
              <ShareInput
                key={formInput.label}
                formInput={formInput}
                register={register}
              />
            );
          })}
          <input
            type="submit"
            value="Submit"
            className="border-gray-400 p-4 border-2 rounded hover:border-white"
          />
        </form>
      )}
    </>
  );
};
export default Share;

const ShareInput = ({ formInput, register }) => {
  const { label, input, type, required, options } = formInput;
  return (
    <label key={input} className="flex flex-col">
      {label}
      {type === 'textarea' ? (
        <textarea
          className="p-2 m-2 text-black rounded-md"
          {...register(input)}
        />
      ) : type === 'select' ? (
        <select className="p-2 m-2 text-black rounded-md" {...register(input)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="p-2 m-2 text-black rounded-md"
          type={type}
          {...register(input)}
        />
      )}
      {/* {errors[input] && <span>This field is required</span>} */}
    </label>
  );
};
