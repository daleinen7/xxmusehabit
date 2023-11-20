"use client";
import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

import navData from "@/lib/navData";
import Link from "next/link";

const Nav = () => {
  const { user } = UserAuth();
  // console.log("USER: ", user);
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
      </ul>
    </nav>
  );
};
export default Nav;
