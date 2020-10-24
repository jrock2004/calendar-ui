import React from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';

import EventContent from './EventContent';

export const RenderEventContent = (eventInfo) => {
  const { timeText, event } = eventInfo;
  const customerName = event.extendedProps.customer !== undefined ? event.extendedProps.customer.fullName : '';
  const distance = differenceInMinutes(event.end, event.start);

  return <EventContent
    distance={distance}
    timeText={timeText}
    customerName={customerName}
    title={event.title}
  />
};

export default RenderEventContent;
