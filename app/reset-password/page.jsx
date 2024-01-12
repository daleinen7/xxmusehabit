'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import FormInput from '../components/FormInput';

const formData = [
  {
    id: 'new-password',
    type: 'password',
    label: 'New Password',
    placeholder: 'password',
    required: true,
  },
  {
    id: 'confirm-password',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'confirm password',
    required: true,
  },
];

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: '',
  });
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = form;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await confirmPasswordReset(oobCode, newPassword);
      // Password reset successful, you can now redirect the user
      // router.push('/login');
      setSuccess(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Password reset failed. Please try again.');
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
          {success ? (
            <h2 className="font-satoshi text-[2.25rem] font-bold mb-[1.125rem">
              Reset Successful!
            </h2>
          ) : (
            <div>
              <h2 className="font-satoshi text-[2.25rem] font-bold mb-[1.125rem">
                Reset Password
              </h2>
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
          )}
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
