import Image from 'next/image';
import getFileType from '../../lib/getFileType';
import FollowButton from './FollowButton';

const PostCard = ({ post, setShowModal }) => {
  const { id, title, description, image, draft, poster, format, posterData } =
    post;

  const mediaType = getFileType(format);

  const openPost = () => {
    setShowModal(post);
  };

  return (
    <article>
      <button onClick={openPost} className="w-full">
        <Image
          src={image}
          alt={title}
          className="aspect-[303/233]"
          width={303}
          height={233}
          layout="responsive"
        />

        {/* {mediaType === 'image' && (
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
        )} */}
      </button>
      <div className="flex justify-between">
        <div>
          {' '}
          <Image
            className="rounded-full"
            src={posterData.profilePic}
            alt={posterData.username}
          />{' '}
          {posterData.username}
        </div>
        <FollowButton artistUid={poster} />
      </div>
    </article>
  );
};
export default PostCard;
