'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
  });

  const router = useRouter();

  const { emailSignUp } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emailSignUp(form.email, form.password, form.username);
    router.push('/');
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  return (
    <div>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={form.email}
          onChange={handleFormChange}
        />
        <label htmlFor="username">Username</label>
        <input
          type="username"
          id="username"
          value={form.username}
          onChange={handleFormChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={form.password}
          onChange={handleFormChange}
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};
export default SignUp;
