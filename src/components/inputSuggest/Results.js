import React from 'react';

export const Results = ({ listItems, resultsEl }) => {
  return (
    <div className="mt-1 bg-white shadow-xl rounded-sm relative">
      <ul
        ref={resultsEl}
        tabIndex="-1"
        aria-labelledby="suggest-label"
        className="rounded-sm shadow-xl absolute bg-white z-20 inset-x-0"
      >
        {listItems}
      </ul>
    </div>
  );
};

export default Results;
