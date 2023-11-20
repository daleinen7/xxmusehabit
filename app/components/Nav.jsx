"use client";
import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

import navData from "@/lib/navData";
import Link from "next/link";

const Nav = () => {
  const { user, googleSignIn, logOut } = UserAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            <h1>Musehabit</h1>
          </Link>
        </li>
        {navData.map((navItem) => (
          <li key={navItem.url}>
            <Link href={navItem.url}>{navItem.text}</Link>
          </li>
        ))}
        {user ? (
          <>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={handleLogOut}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button onClick={handleSignIn}>Login</button>
            </li>
            <li>
              <button onClick={handleSignIn}>Sign Up</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
export default Nav;
