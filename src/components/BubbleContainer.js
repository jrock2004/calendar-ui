import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Heading } from '@mbkit/typography';
import { Button } from '@mbkit/button';
import { IconClose, IconComputer } from '@mbkit/icon';

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
        <Heading as="h4" color="white">
          {title}
        </Heading>
        <div>
          <button type="button" onClick={handleExpand}>
            <IconComputer />
          </button>
          <button type="button" onClick={toggleBubble}>
            <IconClose />
          </button>
        </div>
      </header>
      <main className="px-4 py-8">{children}</main>
      <footer className="mt-auto border-t px-4 py-6">
        <Button type="submit" variant="primary" className="w-full">
          {submitButtonText}
        </Button>
      </footer>
    </form>
  );
};

BubbleContainer.propTypes = {
  children: PropTypes.element,
  handleSubmit: PropTypes.func,
  submitButtonText: PropTypes.string,
  title: PropTypes.string,
  toggleBubble: PropTypes.func,
};

export default BubbleContainer;
