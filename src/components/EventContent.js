import React from 'react';
import { Text } from '@mbkit/typography';
import { IconCheckMark } from '@mbkit/icon';

export const EventContent = ({ distance, timeText, customerName, status, title }) => {
  if (distance <= 15) {
    return (
      <div role="button" tabIndex="0" className="flex justify-between px-4">
        <Text color="white">{timeText}</Text>
        <Text color="white" className="hidden">
          {customerName}
        </Text>
        <div className="flex items-center">
          {status === 2 && (
            <div className="icon-container mr-1">
              <IconCheckMark height="20" width="20" />
            </div>
          )}
          <Text className="inline-block" color="white" size={5}>
            {title}
          </Text>
        </div>
      </div>
    );
  } else if (distance <= 30) {
    return (
      <div role="button" tabIndex="0" className="flex flex-col">
        <div className="flex justify-between">
          <Text color="white">{timeText}</Text>
          <Text color="white" size={5}>
            {customerName}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text color="white" size={5}>
            {title}
          </Text>
          {status === 2 && (
            <div className="icon-container">
              <IconCheckMark height="20" width="20" />
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div role="button" tabIndex="0" className="flex flex-col">
        <div className="flex justify-between">
          <Text color="white">{timeText}</Text>
          {status === 2 && (
            <div className="icon-container">
              <IconCheckMark height="20" width="20" />
            </div>
          )}
        </div>
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
