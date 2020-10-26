import React from 'react';
import differenceInMinutes from 'date-fns/differenceInMinutes';

import EventContent from './EventContent';
import {customers} from '../data/customers';

export const RenderEventContent = (eventInfo) => {
  const { timeText, event } = eventInfo;
  const customerId = event.extendedProps.customerId !== undefined ? event.extendedProps.customerId : '';
  const distance = differenceInMinutes(event.end, event.start);
  const customer = customers.find(cus => cus.id === customerId);
  const customerName = customer ? `${customer.firstName} ${customer.lastName}`: '';

  return <EventContent
    distance={distance}
    timeText={timeText}
    customerName={customerName}
    title={event.title}
  />
};

export default RenderEventContent;
