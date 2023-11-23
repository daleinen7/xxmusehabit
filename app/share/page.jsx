"use client";
import { useForm } from "react-hook-form";
import { ref, set, onValue, push, update, child } from "firebase/database";
import { storage, db } from "../../lib/firebase";

const Share = () => {
  const { register, handleSubmit, errors } = useForm();

  const form = [
    { label: "Title", input: "title", type: "text", required: true },
    {
      label: "Description",
      input: "description",
      type: "text",
      required: true,
    },
    { label: "Image", input: "image", type: "file", required: true },
    { label: "Video", input: "video", type: "file", required: true },
    { label: "Category", input: "category", type: "text", required: true },
    { label: "Tags", input: "tags", type: "text", required: true },
  ];

  const onSubmit = async (data) => {
    // Extract form data
    const { title, description, file } = data;

    // function writePost(title, description) {
    //   set(ref(db, "posts/"), {
    //     title,
    //     description,
    //   });
    // }

    // writePost(title, description);

    // Get a key for a new Post.
    const newPostKey = push(child(ref(db), "posts")).key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates["/posts/" + newPostKey] = data;

    return update(ref(db), updates);
  };

  const results = ref(db, "posts/");
  onValue(results, (snapshot) => {
    const data = snapshot.val();
    console.log("data", data);
  });

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
