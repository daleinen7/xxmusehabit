'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';

const formData = [
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'email',
    required: true,
  },
  {
    id: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'password',
    required: true,
  },
];

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
    <div className="flex w-full">
      <div className="w-1/2 object-cover h-[calc(100vh-3rem)] ">
        <img
          src="https://fakeimg.pl/756x900/c1c1c1/909090"
          alt="login page"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-47rem flex flex-col justify-center items-center w-full max-w-[20.8125rem]">
          <h2>Log In</h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center gap-6 w-full"
          >
            {formData.map((item) => (
              <label
                htmlFor={item.id}
                key={item.id}
                className="flex flex-col"
              >
                {item.label}
                <input
                  type={item.type}
                  id={item.id}
                  value={form[item.id]}
                  onChange={handleFormChange}
                  required={item.required}
                  className="text-black p-[0.625rem] border border-black rounded-md w-full"
                />
              </label>
            ))}
            <button
              type="submit"
              className="mt-6 bg-gray-400 rounded-md px-[0.875] py-[0.625rem]"
            >
              Log In
            </button>
          </form>

          <div className="">Or</div>
          <button
            type="button"
            className="mt-6 border-black rounded-md px-[0.875] py-[0.625rem]"
          >
            Log In with Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
