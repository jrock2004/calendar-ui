import React, { useState } from 'react';

export const BubbleContainer = ({
  children,
  handleSubmit,
  submitButtonText,
  title,
  toggleBubble,
}) => {
  const [bubble, setBubble] = useState({
    isExpanded: false,
  });

  const getCssClass = () => {
    let defaults = 'absolute border bg-white flex flex-col bottom-0 right-0 bubble-container';

    return bubble.isExpanded ? `${defaults} top-0 left-0` : `${defaults} w-1/3 shadow-2xl`;
  };

  const handleExpand = () => {
    setBubble({
      ...bubble,
      isExpanded: !bubble.isExpanded,
    });
  };

  return (
    <form className={getCssClass()} onSubmit={handleSubmit}>
      <header className="bg-black text-white px-4 py-2 flex justify-between items-center">
        <h4>{title}</h4>
        <div>
          <button type="button" onClick={handleExpand}>
            <svg
              className="w-6 h-6 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              ></path>
            </svg>
          </button>
          <button type="button" onClick={toggleBubble}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </header>
      <main className="px-4 py-8">{children}</main>
      <footer className="mt-auto border-t px-4 py-6">
        <button
          type="submit"
          className="border rounded-sm bg-teal-400 text-white text-xl uppercase x-4 py-2 w-full"
        >
          {submitButtonText}
        </button>
      </footer>
    </form>
  );
};

export default BubbleContainer;
