"use client";
import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

import navData from "@/lib/navData";
import Link from "next/link";

const NavItem = ({ url, func, text }) => (
  <li key={url} className="text-gray-400 hover:text-white">
    {url ? (
      <Link href={url}>{text}</Link>
    ) : (
      <button onClick={func}>{text}</button>
    )}
  </li>
);

const Nav = () => {
  const { user, userProfile, googleSignIn, logOut } = UserAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  return (
    <nav className="p-4">
      <ul className="flex gap-6">
        <li>
          <Link href="/">
            <h1>Musehabit</h1>
          </Link>
        </li>
        {navData.map((navItem) => {
          if (navItem.function === "handleSignIn") navItem.func = handleSignIn;
          if (navItem.function === "handleLogOut") navItem.func = handleLogOut;

          if (
            navItem.auth === undefined ||
            (navItem.auth && user) ||
            (!navItem.auth && !user)
          ) {
            return <NavItem key={navItem.text} {...navItem} />;
          }

          return null;
        })}
      </ul>
    </nav>
  );
};
export default Nav;
