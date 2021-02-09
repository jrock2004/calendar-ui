import React from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';

import EventContent from './EventContent';

export const RenderEventContent = (eventInfo) => {
  const { timeText, event } = eventInfo;
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
};

export default RenderEventContent;
