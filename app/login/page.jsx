'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();

  const { emailSignIn } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emailSignIn(form.email, form.password);
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
export default Login;
