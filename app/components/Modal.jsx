import React, { useState, useRef } from 'react';
import useClickOutside from '@/lib/UseClickOutside';
import Button from './Button';
import icons from '@/lib/icons';

const Modal = ({ toggleText, children, showModal, setShowModal }) => {
  const wrapperRef = useRef(null);

  useClickOutside(wrapperRef, () => {
    setShowModal(false);
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="relative flex flex-col">
      {showModal && <div className="fixed inset-0 bg-black opacity-40" />}

      {showModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded p-4 w-full md:max-w-2xl max-h-[97%] overflow-y-scroll">
          <div className="flex justify-end w-full">
            <button onClick={handleCloseModal} className="flex justify-end">
              {icons.close}
            </button>
          </div>
          {children}
        </div>
      )}
    </div>
  );
};

export default Modal;
