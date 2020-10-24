import React from 'react';

export const RenderEventContent = (eventInfo) => {
  let { timeText, event } = eventInfo;

  return (
    <div>
      <span className="mr-4 font-semibold">{timeText}</span>
      <span>{event.title}</span>
    </div>
  );
};

export default RenderEventContent;
