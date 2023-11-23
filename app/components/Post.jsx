import Image from "next/image";
const Post = ({ post }) => {
  return (
    <article>
      <Image src={post.image} alt={post.title} width={400} height={240} />
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      {/* Additional post details */}
    </article>
  );
};
export default Post;
