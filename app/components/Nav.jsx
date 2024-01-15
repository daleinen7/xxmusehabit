'use client';
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { daysUntilNextPost } from '../../lib/daysUntilNextPost';
import navData from '../../lib/navData';
import Link from 'next/link';

const NavItem = ({ url, func, text }) => (
  <li key={url} className="text-gray-400 hover:text-black">
    {url ? (
      <Link href={url}>{text}</Link>
    ) : (
      <button onClick={func}>{text}</button>
    )}
  </li>
);

const Nav = () => {
  const { user, userProfile, canPost, daysUntilNextPost, logOut } = UserAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  return (
    <nav className="p-4">
      <ul className="flex gap-6 items-center">
        <li>
          <Link href="/">
            <h1 className="text-xl">Musehabit</h1>
          </Link>
        </li>
        {navData.map((navItem) => {
          if (navItem.function === 'handleLogOut') navItem.func = handleLogOut;

          if (navItem.text === 'Share') {
            if (canPost) {
              return <NavItem key={navItem.text} {...navItem} />;
            }
          }

          if (
            navItem.auth === undefined ||
            (navItem.auth && user) ||
            (!navItem.auth && !user)
          ) {
            return <NavItem key={navItem.text} {...navItem} />;
          }

          return null;
        })}
        {user && userProfile && (
          <li>
            <Link href={`/artist/${userProfile.url}/profile`}>
              Your Profile
            </Link>
          </li>
        )}
      </ul>
      {user && (
        <div>
          {canPost
            ? `${daysUntilNextPost} days until post is due`
            : `Can post again in ${daysUntilNextPost} days`}
        </div>
      )}
    </nav>
  );
};
export default Nav;
