import React from 'react';
import { format } from 'date-fns';

export const GetAppointmentTime = ({end, start}) => {
  return (
    <div className="mb-8">
      <span className="font-semibold">Start Time: </span>
      <span>{format(start, 'hh:mm aaa')}</span>
      <span className="mx-2">-</span>
      <span className="font-semibold">End Time: </span>
      <span>{format(end, 'hh:mm aaa')}</span>
    </div>
  )
}

export default GetAppointmentTime;
