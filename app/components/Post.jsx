import React from 'react';
import Image from 'next/image';
import SaveButton from './SaveButton';
import FollowButton from './FollowButton';

const Post = ({ post }) => {
  const { id, title, description, image, draft, format, posterData } = post;
  const { username, location, photoUrl, medium } = posterData;

  const postedAt = new Date(post.postedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col w-full gap-9">
      <div className="flex w-full gap-4 items-center -pt-2">
        <Image
          src={photoUrl}
          alt={username}
          width={65}
          height={65}
          className="rounded-full"
        />
        <div className=" font-satoshi">
          <div className=" text-2xl">{username}</div>
          <div className="text-sm">
            {medium} | {location} | {postedAt}
          </div>
        </div>
        <div className="items-end ml-auto">
          <FollowButton />
        </div>
      </div>
      <Image
        src={image}
        alt={title}
        width={704}
        height={560}
        className="rounded"
      />
      <div className="flex items-start">
        <div className="font-satoshi text-2xl font-medium">{title}</div>
        <div className="ml-auto">
          <SaveButton />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium ">About this project:</h3>
        <div className="font-satoshi">{description}</div>
      </div>
    </div>
  );
};
export default Post;
