'use client';
import { signIn } from 'next-auth/react';

const Login = () => {
  return (
    <>
      <button onClick={() => signIn('google')}>Login</button>
    </>
  );
};
export default Login;
