"use client";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { ref, push, update, child, serverTimestamp } from "firebase/database";
import { storage, db } from "../../lib/firebase";
import uploadFileToStorage from "../../lib/uploadFileToStorage";
import { canUserPost } from "../../lib/canUserPost";

const Share = () => {
  const { register, handleSubmit, errors } = useForm();
  const [shared, setShared] = useState(false);

  const categories = [
    "Music",
    "Prose",
    "Poetry",
    "Film",
    "Animation",
    "Painting",
    "Sculpture",
    "Drawing",
    "Photography",
  ];

  const { user } = UserAuth();

  const allowedFileFormats = ["png", "jpg", "jpeg", "pdf", "mp3", "mp4", "gif"];

  const form = [
    {
      label: "Title of your Submission",
      input: "title",
      type: "text",
      required: true,
    },
    {
      label: "Description - tell us about what you've been working on!",
      input: "description",
      type: "textarea",
      required: true,
    },
    { label: "Preview Image", input: "image", type: "file", required: true },
    {
      label: "Category",
      input: "category",
      type: "select",
      options: categories,
      required: true,
    },
    { label: "Draft", input: "draft", type: "file", required: true },
    { label: "Tags", input: "tags", type: "text", required: true },
  ];

  const onSubmit = async (data) => {
    const { title, description, image, draft, category, tags } = data;

    // check if draft is allowed file format
    const draftFileFormat = draft[0].name.split(".").pop();
    if (!allowedFileFormats.includes(draftFileFormat)) {
      console.error("Draft file format not allowed");
      alert("Draft file format not allowed");
      return;
    }

    const userCanPost = await canUserPost(user.uid);

    // check if user is allowed to post
    if (!userCanPost) {
      console.error("User not allowed to post");
      alert("User not allowed to post");
      return;
    }

    const imageFile = image[0];
    const draftFile = draft[0];

    // Generate a unique key for the new post
    const newPostKey = push(child(ref(db), "posts")).key;

    const today = new Date();

    const imageFileName = `${
      user.uid
    }/${today.getFullYear()}/${today.getMonth()}/cover-image-${newPostKey}.${imageFile.name
      .split(".")
      .pop()}`;
    const imageFileUrl = await uploadFileToStorage(
      storage,
      imageFileName,
      imageFile
    );

    const draftFileName = `${
      user.uid
    }/${today.getFullYear()}/${today.getMonth()}/draft-${newPostKey}.${draftFile.name
      .split(".")
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
      format: draftFile.name.split(".").pop(),
      poster: user.uid,
      postedAt: serverTimestamp(),
    };

    // Write the new post's data in the posts list
    const updates = {};
    updates["/posts/" + newPostKey] = newPost;

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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {form.map((formInput) => {
          const { label, input, type, required, options } = formInput;
          return (
            <label key={input} className="flex flex-col">
              {label}
              {type === "textarea" ? (
                <textarea
                  className="p-2 m-2 text-black rounded-md"
                  {...register(input)}
                />
              ) : type === "select" ? (
                <select
                  className="p-2 m-2 text-black rounded-md"
                  {...register(input)}
                >
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
        })}
        <input
          type="submit"
          value="Submit"
          className="border-gray-400 p-4 border-2 rounded hover:border-white"
        />
      </form>
    </>
  );
};
export default Share;
