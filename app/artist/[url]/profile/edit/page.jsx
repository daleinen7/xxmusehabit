'use client';
import React, { useState } from 'react';
import FormInput from '../../../../components/FormInput';
import { UserAuth } from '@/app/context/AuthContext';
import uploadFileToStorage from '@/lib/uploadFileToStorage';

const formData = [
  {
    id: 'profile',
    type: 'file',
    condition: 'profile',
    label: 'Upload Profile Image',
  },
  {
    id: 'displayName',
    type: 'text',
    label: 'Display Name',
    placeholder: 'display name',
  },
  {
    id: 'location',
    type: 'text',
    label: 'Location',
    placeholder: 'location',
  },
  {
    id: 'bio',
    type: 'textarea',
    label: 'Bio',
    placeholder: 'bio',
  },
];

const EditProfile = () => {
  const [form, setForm] = useState({
    profile: null,
    displayName: '',
    location: '',
    bio: '',
  });

  const [imagePreview, setImagePreview] = useState(null);

  const { user, userProfile, updateUserProfile } = UserAuth();

  console.log(user, userProfile);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setForm({ ...form, profile: file }); // Update form with the selected file
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(form);
  };

  return (
    <>
      <h2>Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-[1.5rem]"
      >
        {formData.map((item) => (
          <div key={item.id}>
            {item.id === 'profile' ? (
              <>
                <label htmlFor={item.id} className="block font-bold">
                  {item.label}
                </label>
                <input
                  type={item.type}
                  id={item.id}
                  onChange={handleFileInputChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  htmlFor={item.id}
                >
                  Choose Image
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-full"
                  />
                )}
              </>
            ) : (
              <FormInput
                id={item.id}
                type={item.type}
                label={item.label}
                placeholder={item.placeholder}
                handleFormChange={handleFormChange}
                value={form[item.id]}
                profile
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="mt-6 bg-gray-400 rounded-md px-[0.875rem] py-[0.625rem]"
        >
          Save Profile Info
        </button>
      </form>
    </>
  );
};
export default EditProfile;
