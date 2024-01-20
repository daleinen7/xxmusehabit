import Image from 'next/image';
import getFileType from '../../lib/getFileType';
import FollowButton from './FollowButton';

const PostCard = ({ post }) => {
  const { id, title, description, image, draft, poster, format } = post;

  const mediaType = getFileType(format);

  return (
    <article>
      <Image src={image} alt={title} width={400} height={240} />
      <h3>{title}</h3>
      <p className="whitespace-break-spaces">{description}</p>
      {mediaType === 'image' && (
        <Image src={draft} alt={title} width={400} height={240} />
      )}
      {mediaType === 'video' && (
        <video width={400} height={240} controls>
          <source src={draft} />
          Your browser does not support the video tag.
        </video>
      )}
      {mediaType === 'audio' && (
        <audio controls>
          <source src={draft} />
          Your browser does not support the audio tag.
        </audio>
      )}
      <FollowButton artistUid={poster} />
    </article>
  );
};
export default PostCard;
