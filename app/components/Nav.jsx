'use client';
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { daysUntilNextPost } from '../../lib/daysUntilNextPost';
import navData from '../../lib/navData';
import Link from 'next/link';

const NavItem = ({ url, func, text }) => (
  <li
    key={url}
    className="font-satoshi text-lg font-medium text-gray-500 hover:text-black"
  >
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
    <nav className="bg-slate-200 py-3">
      <ul className="width-wrapper w-full flex justify-between items-center">
        <li>
          <Link href="/">
            <h1 className="font-satoshi text-4xl font-bold">Musehabit</h1>
          </Link>
        </li>
        <div className="flex gap-6 items-center">
          {navData.map((navItem) => {
            if (navItem.function === 'handleLogOut')
              navItem.func = handleLogOut;
            if (user && navItem.text === 'Share') {
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
            <NavItem
              key="Your Profile"
              text="Your Profile"
              url={`/artist/${userProfile.url}/profile`}
            />
          )}
        </div>
      </ul>
      {user && (
        <div className="width-wrapper text-sm">
          {canPost
            ? `${daysUntilNextPost} days until post is due`
            : `Can post again in ${daysUntilNextPost} days`}
        </div>
      )}
    </nav>
  );
};
export default Nav;
