import Image from "next/image";
import getFileType from "../../lib/getFileType";
import FollowButton from "./FollowButton";

const Post = ({ post }) => {
  const mediaType = getFileType(post.format);
  console.log("POST: ", post);

  return (
    <article>
      <Image src={post.image} alt={post.title} width={400} height={240} />
      <h3>{post.title}</h3>
      <p className="whitespace-break-spaces">{post.description}</p>
      {mediaType === "image" && (
        <Image src={post.draft} alt={post.title} width={400} height={240} />
      )}
      {mediaType === "video" && (
        <video width={400} height={240} controls>
          <source src={post.draft} />
          Your browser does not support the video tag.
        </video>
      )}
      {mediaType === "audio" && (
        <audio controls>
          <source src={post.draft} />
          Your browser does not support the audio tag.
        </audio>
      )}
      <FollowButton artistUid={post.poster} />
    </article>
  );
};
export default Post;
