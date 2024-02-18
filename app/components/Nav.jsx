'use client';
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import Link from 'next/link';
import icons from '@/lib/icons';

const NavItem = ({ url, func, text, arrow }) => (
  <li className="font-satoshi text-lg font-medium text-gray-500 hover:text-black">
    {url ? (
      <Link href={url} className="flex items-center">
        {text}
        {arrow && <span className={` text-3xl`}>{icons.arrow}</span>}
      </Link>
    ) : (
      <button onClick={func} className="flex items-center">
        {text} {arrow && <span className={` text-3xl`}>{icons.arrow}</span>}
      </button>
    )}
  </li>
);

const Nav = () => {
  const { user, userProfile, canPost, daysUntilNextPost, logOut } = UserAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-slate-200 py-3">
      <ul className="width-wrapper w-full flex justify-between items-center">
        <li>
          <Link href="/">
            <h1 className="font-satoshi text-4xl font-bold">Musehabit</h1>
          </Link>
        </li>
        <div className="flex gap-6 items-center">
          <NavItem text="About" url="/about" />

          {!user && (
            <>
              <NavItem text="Login" url="/login" />

              <NavItem text="Sign Up" url="/signup" />
            </>
          )}

          {user && (
            <>
              <NavItem text="My Profile" func={handleDropdown} arrow />
              {showDropdown && (
                <ul className="absolute top-12 right-0 bg-white shadow-lg p-4">
                  <li>
                    <Link href={`/profile/${userProfile.username}`}>
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile/edit">Edit Profile</Link>
                  </li>
                  <li>
                    <Link href="/profile/settings">Settings</Link>
                  </li>
                  <li>
                    <NavItem func={handleLogOut} text="Logout" />
                  </li>
                </ul>
              )}
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};
export default Nav;
