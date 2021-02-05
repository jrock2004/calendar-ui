import React from 'react';
import { Text } from '@mbkit/typography';

export const EventContent = ({ distance, timeText, customerName, title }) => {
  if (distance <= 15) {
    return (
      <div className="flex justify-between px-4">
        <Text color="white">{timeText}</Text>
        <Text color="white" className="hidden">
          {customerName}
        </Text>
        <Text color="white" size={5}>
          {title}
        </Text>
      </div>
    );
  } else if (distance <= 30) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between">
          <Text color="white">{timeText}</Text>
          <Text color="white" size={5}>
            {customerName}
          </Text>
        </div>
        <Text color="white" size={5}>
          {title}
        </Text>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        <Text color="white">{timeText}</Text>
        <Text color="white" size="5">
          {customerName}
        </Text>
        <Text color="white" size={5}>
          {title}
        </Text>
      </div>
    );
  }
};

export default EventContent;
