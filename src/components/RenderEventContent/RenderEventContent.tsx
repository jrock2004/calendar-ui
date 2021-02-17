import React from 'react';
import { EventContentArg } from '@fullcalendar/react';

import { AppointmentEvent } from './AppointmentEvent/AppointmentEvent';
import { GhostEvent } from './GhostEvent/GhostEvent';

export const RenderEventContent = (eventContent: EventContentArg) => {
  const { timeText, event } = eventContent,
    { status } = event.extendedProps;

  if (status === 3) {
    return <GhostEvent timeText={timeText} />;
  } else {
    const customerName: string =
      event.extendedProps.customerName !== undefined ? event.extendedProps.customerName : '';

    return (
      <AppointmentEvent
        customerName={customerName}
        status={status}
        timeText={timeText}
        title={event.title}
      />
    );
  }
};
