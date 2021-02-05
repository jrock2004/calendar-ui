import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

export const GetAppointmentTime = ({ end, start }) => {
  let startDate = new Date(start),
    endDate = new Date(end);

  return (
    <div className="mb-8">
      <span className="font-semibold">Start Time: </span>
      <span>{format(startDate, 'hh:mm aaa')}</span>
      <span className="mx-2">-</span>
      <span className="font-semibold">End Time: </span>
      <span>{format(endDate, 'hh:mm aaa')}</span>
    </div>
  );
};

GetAppointmentTime.propTypes = {
  end: PropTypes.string,
  start: PropTypes.string,
};

export default GetAppointmentTime;
