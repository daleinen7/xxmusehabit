import { IoClose } from 'react-icons/io5';
import { FaRegBookmark } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { MdComment } from 'react-icons/md';
import { MdOutlineInsertComment } from 'react-icons/md';
import { MdFileUpload } from 'react-icons/md';
import { TfiWrite } from 'react-icons/tfi';

const icons = {
  close: <IoClose />,
  bookmark: <FaRegBookmark className=" text-xl" />,
  plus: <FiPlus className="" />,
  comment: <MdComment />,
  closedComment: <MdOutlineInsertComment />,
  upload: <MdFileUpload />,
  write: <TfiWrite />,
};

export default icons;
