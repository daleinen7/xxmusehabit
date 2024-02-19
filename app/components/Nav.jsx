'use client';
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import Link from 'next/link';
import icons from '@/lib/icons';

const NavItem = ({ url, func, text, arrow, children }) => (
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
    {children}
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
    <nav className="bg-slate-200 py-4">
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
              <NavItem text="My Profile" func={handleDropdown} arrow>
                {showDropdown && (
                  <ul className="absolute mt-2 bg-white shadow-lg p-4 z-50">
                    <li>
                      <Link href={`/artist/${userProfile.username}`}>
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
                      <button
                        onClick={handleLogOut}
                        className="flex items-center"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </NavItem>
              |
              {canPost ? (
                <li className="relative">
                  <Link href="/share" className="btn btn-secondary">
                    Make Your Post
                  </Link>
                  <div className="absolute -top-3 right-0 bg-red-600 text-white rounded-[10px] px-[3px] -py-1">
                    {daysUntilNextPost} Days
                  </div>
                </li>
              ) : (
                <li>
                  <div>Post again in {daysUntilNextPost} days</div>
                </li>
              )}
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};
export default Nav;
