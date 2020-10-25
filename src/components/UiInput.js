import React from 'react';

export const UiInput = ({name, label, value, handleChange}) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={name} className="mb-2 font-semibold text-sm">{label}</label>
      <input
        type="text"
        className="border w-full px-2 py-1 rounded-sm"
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

export default UiInput;
