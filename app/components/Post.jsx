'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import getFileType from '@/lib/getFileType';
import SaveButton from './SaveButton';
import FollowButton from './FollowButton';
import icons from '@/lib/icons';
import CommentsSection from './CommentsSection';

const Post = ({ post }) => {
  const {
    id,
    title,
    description,
    image,
    draft,
    format,
    posterData,
    toolsUsed,
  } = post;
  const { username, location, photoURL, medium } = posterData;
  const [showComments, setShowComments] = useState(false);

  console.log('POST: ', post.format);

  const postedAt = new Date(post.postedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const toggleShowComments = () => {
    setShowComments(!showComments);
  };

  const displayFile = {
    image: (
      <Image
        src={image}
        alt={title}
        width={704}
        height={560}
        className="rounded"
      />
    ),
    video: (
      <video
        src={draft}
        controls
        className="rounded"
        width="100%"
        height="auto"
      />
    ),
    audio: (
      <audio
        src={draft}
        controls
        className="rounded"
        width="100%"
        height="auto"
      />
    ),
  };

  return (
    <div className="width-wrapper flex">
      <div className="flex flex-col w-full gap-9">
        <div className="flex w-full gap-4 items-center -pt-2">
          {displayFile[getFileType(format)] || (
            <div className="w-20 h-20 rounded-full bg-slate-300" />
          )}
          <div className="font-satoshi">
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
          <div className="ml-auto flex gap-5">
            <button onClick={toggleShowComments} className="text-2xl">
              {icons.comment}
            </button>
            <SaveButton />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium ">About this project:</h3>
          <div className="font-satoshi">{description}</div>
        </div>
        <div>
          <h3 className="text-lg font-medium ">Tools Used:</h3>
          <div className="font-satoshi">{toolsUsed}</div>
        </div>
        {/* {post.tags && (
          <div>
            <h3 className="text-lg font-medium mb-2">Tags:</h3>
            <div className="font-satoshi">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm mr-2 py-[0.3125rem] px-[0.625rem] rounded-full bg-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )} */}
      </div>
      {showComments && <CommentsSection postId={post.id} />}
    </div>
  );
};
export default Post;
