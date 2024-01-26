import Image from 'next/image';
import getFileType from '../../lib/getFileType';
import SaveButton from './SaveButton';

const PostCard = ({ post, setShowModal }) => {
  const { id, title, description, image, draft, poster, format, posterData } =
    post;

  const mediaType = getFileType(format);

  const openPost = () => {
    setShowModal(post);
  };

  return (
    <article>
      <button onClick={openPost} className="group w-full relative">
        <Image
          src={image}
          alt={title}
          className="aspect-[303/233]"
          width={303}
          height={233}
          layout="responsive"
        />

        {mediaType === 'video' && (
          <div className="group-hover:hidden bg-neutral-950 opacity-50 absolute top-0 left-0 w-full h-full object-cover flex items-center justify-center">
            <Image
              src={'/images/video-play.svg'}
              alt={'go to video'}
              className=""
              layout="fill"
            />
          </div>
        )}

        {mediaType === 'audio' && (
          <div className="group-hover:hidden bg-neutral-950 opacity-50 absolute top-0 left-0 w-full h-full object-cover flex items-center justify-center">
            <Image
              src={'/images/audio-play.svg'}
              alt={'go to audio'}
              className=""
              layout="fill"
            />
          </div>
        )}
      </button>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Image
            className="rounded-full"
            src={posterData.photoUrl}
            alt={posterData.username}
            width={33}
            height={33}
          />
          {posterData.username}
        </div>
        <SaveButton artistUid={poster} />
      </div>
    </article>
  );
};
export default PostCard;
