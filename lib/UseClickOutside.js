import { useEffect } from 'react';

const useClickOutside = (ref, closeInput) => {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        closeInput();
        // stopPropagation is optional -- remove if breaking
        e.stopPropagation();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

export default useClickOutside;
