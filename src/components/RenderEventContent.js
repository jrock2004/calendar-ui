import React from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';

import EventContent from './EventContent';

export const RenderEventContent = (eventInfo) => {
  const { timeText, event } = eventInfo,
    { status } = event.extendedProps;

  if (status === 3) {
    return <div className="bg-white text-black">Ghost Appointment</div>;
  } else {
    const customer =
      event.extendedProps.customer.firstName !== undefined ? event.extendedProps.customer : '';
    const distance = differenceInMinutes(event.end, event.start);
    const status = event.extendedProps.status;

    return (
      <EventContent
        customerName={customer.fullName}
        distance={distance}
        status={status}
        timeText={timeText}
        title={event.title}
      />
    );
  }
};

export default RenderEventContent;
