import React from 'react';

export const EventContent = ({distance, timeText, customerName, title}) => {
  if (distance <= 15) {
    return (
      <div className="flex justify-between px-4">
        <span className="text-sm">{timeText}</span>
        <span className="font-semibold hidden">{customerName}</span>
        <span className="text-sm">{title}</span>
      </div>
    )
  } else if (distance <= 30) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="text-sm">{timeText}</span>
          <span className="font-semibold mr-4">{customerName}</span>
        </div>
        <span className="text-sm">{title}</span>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col">
        <span className="text-sm mb-2">{timeText}</span>
        <span className="font-semibold">{customerName}</span>
        <span className="text-sm">{title}</span>
      </div>
    )
  }
}

export default EventContent;
