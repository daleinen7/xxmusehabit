import React from 'react';

const FormInput = ({ id, label, type, handleFormChange, required, value }) => {
  if (type === 'text' || type === 'password' || type === 'email') {
    return (
      <label htmlFor={id} key={id} className="flex flex-col gap-2">
        {label}
        <input
          type={type}
          id={id}
          value={value}
          onChange={handleFormChange}
          required={required}
          className="text-black p-[0.625rem] border border-black rounded-md w-full"
        />
      </label>
    );
  }
};
export default FormInput;
