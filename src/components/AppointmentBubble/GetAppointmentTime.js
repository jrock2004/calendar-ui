import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Text } from '@mbkit/typography';

export const GetAppointmentTime = ({ end, start }) => {
  let startDate = new Date(start),
    endDate = new Date(end);

  const labelStyles = {
    marginRight: '.5rem',
  };

  return (
    <div className="mb-8">
      <Text as="span" bold={true} className="inline-block" style={labelStyles}>
        Start Time:
      </Text>
      <Text as="span">{format(startDate, 'hh:mm aaa')}</Text>
      <span className="mx-2">-</span>
      <Text as="span" bold={true} className="inline-block" style={labelStyles}>
        End Time:
      </Text>
      <Text as="span">{format(endDate, 'hh:mm aaa')}</Text>
    </div>
  );
};

GetAppointmentTime.propTypes = {
  end: PropTypes.instanceOf(Date),
  start: PropTypes.instanceOf(Date),
};

export default GetAppointmentTime;
