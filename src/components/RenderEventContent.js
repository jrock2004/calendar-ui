import React from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';

export const RenderEventContent = (eventInfo) => {
  const { timeText, event } = eventInfo;
  const customerName = event.extendedProps.customer !== undefined ? event.extendedProps.customer.fullName : '';
  const distance = differenceInMinutes(event.end, event.start);

  let eventContent = null;

  if (distance <= 15) {
    eventContent = (
      <div className="flex justify-between px-4">
        <span className="text-sm">{timeText}</span>
        <span className="font-semibold hidden">{customerName}</span>
        <span className="text-sm">{event.title}</span>
      </div>
    )
  } else if (distance <= 30) {
    eventContent = (
      <div className="flex flex-col">
        <div class="flex justify-between">
          <span className="text-sm">{timeText}</span>
          <span className="font-semibold mr-4">{customerName}</span>
        </div>
        <span className="text-sm">{event.title}</span>
      </div>
    )
  } else {
    eventContent = (
      <div className="flex flex-col">
        <span className="text-sm mb-2">{timeText}</span>
        <span className="font-semibold">{customerName}</span>
        <span className="text-sm">{event.title}</span>
      </div>
    )
  }


  return (
    <>
      {eventContent}
    </>
  );
};

export default RenderEventContent;
