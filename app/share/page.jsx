"use client";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { ref as databaseRef, push, update, child } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage, db } from "../../lib/firebase";

const Share = () => {
  const { register, handleSubmit, errors } = useForm();
  const [shared, setShared] = useState(false);

  const form = [
    { label: "Title", input: "title", type: "text", required: true },
    {
      label: "Description",
      input: "description",
      type: "text",
      required: true,
    },
    { label: "Image", input: "image", type: "file", required: true },
    { label: "Category", input: "category", type: "text", required: true },
    { label: "Tags", input: "tags", type: "text", required: true },
  ];

  const onSubmit = async (data) => {
    const { title, description, image, category, tags } = data;

    console.log("Image", image);

    const imageFile = image[0];

    const metadata = {
      contentType: image.type,
    };
    // Generate a unique key for the new post
    const newPostKey = push(child(databaseRef(db), "posts")).key;

    // Upload image to Firebase Storage
    const imageRef = storageRef(storage, `images/${newPostKey}.jpg`);
    await uploadBytes(imageRef, imageFile, metadata);

    // Obtain the download URL for the uploaded image
    const imageUrl = await getDownloadURL(imageRef);

    // Construct the new post object
    const newPost = {
      id: newPostKey,
      title,
      description,
      category,
      tags,
      image: imageUrl,
    };

    // Write the new post's data simultaneously in the posts list and the user's post list
    const updates = {};
    updates["/posts/" + newPostKey] = newPost;

    setShared(true);

    return update(databaseRef(db), updates);
  };

  if (shared === true) return <p>Thanks for sharing the post</p>;

  return (
    <>
      <h2>Share</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {form.map((item) => {
          const { label, input, type, required } = item;
          return (
            <div key={input}>
              <label>
                {label}
                <input
                  className="p-2 m-2 text-black rounded-md"
                  type={type}
                  {...register(input)}
                />
                {/* {errors[input] && <span>This field is required</span>} */}
              </label>
            </div>
          );
        })}
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};
export default Share;
