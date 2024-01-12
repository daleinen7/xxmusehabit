'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';

const formData = [
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'email',
    required: true,
  },
];

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: '',
  });

  const router = useRouter();

  const { passwordReset } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.email) {
      // Call the sendPasswordResetEmail function
      await passwordReset(form.email);
      // Inform the user that a password reset email has been sent
      console.log('Password reset email sent. Check your inbox.');
    } else {
      // Handle the case where no email is provided
      console.error('Please enter your email address to reset your password.');
    }
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
          <h2 className="font-satoshi text-[2.25rem] font-bold mb-[1.125rem">
            Forgot Your Password?
          </h2>
          <p className="font-satoshi mb-10">
            Need an account? It happens! We&apos;ll send password reset
            instructions to your email.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center gap-6 w-full"
          >
            {formData.map((item) => (
              <FormInput
                key={item.id}
                label={item.label}
                type={item.type}
                id={item.id}
                value={form[item.id]}
                handleFormChange={handleFormChange}
                required={item.required}
                className="text-black p-[0.625rem] border border-black rounded-md w-full"
              />
            ))}
            <button
              type="submit"
              className="mt-6 bg-gray-400 rounded-md px-[0.875] py-[0.625rem]"
            >
              Verify Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
